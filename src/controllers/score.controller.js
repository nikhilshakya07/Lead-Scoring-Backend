const storage = require('../utils/storage');
const { calculateRuleScore, getIntentLabel } = require('../services/scoring.service');
const { getAIScore } = require('../services/ai.service');

async function runScoring(req, res) {
  try {
    const offer = storage.getOffer();
    const leads = storage.getLeads();

    // Validation
    if (!offer) {
      return res.status(400).json({
        status: 'error',
        message: 'No offer submitted. Please POST to /offer first'
      });
    }

    if (!leads || leads.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No leads uploaded. Please POST to /leads/upload first'
      });
    }

    // Process each lead
    const results = [];
    
    for (const lead of leads) {
      try {
        // 1. Calculate rule-based score (max 50 points)
        const ruleResult = calculateRuleScore(lead, offer);
        
        // 2. Get AI score (max 50 points)
        const aiResult = await getAIScore(lead, offer);
        
        // 3. Calculate final score
        const finalScore = ruleResult.score + aiResult.points;
        const intent = getIntentLabel(finalScore);

        // 4. Combine reasoning
        const reasoning = `${aiResult.reasoning} Rule score: ${ruleResult.score}/50 (Role: ${ruleResult.breakdown.role.points}, Industry: ${ruleResult.breakdown.industry.points}, Complete: ${ruleResult.breakdown.completeness.points}). AI: ${aiResult.intent} (${aiResult.points}/50).`;

        results.push({
          name: lead.name,
          role: lead.role,
          company: lead.company,
          industry: lead.industry,
          intent,
          score: finalScore,
          reasoning: reasoning.substring(0, 300) // Limit length
        });

      } catch (error) {
        console.error(`Error scoring lead ${lead.name}:`, error.message);
        // Add lead with default score if processing fails
        results.push({
          name: lead.name,
          role: lead.role,
          company: lead.company,
          industry: lead.industry,
          intent: 'Low',
          score: 10,
          reasoning: `Scoring failed: ${error.message}`
        });
      }
    }

    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);

    // Store results
    storage.setResults(results);

    res.json({
      status: 'success',
      message: 'Scoring completed',
      data: {
        total_scored: results.length,
        high_intent: results.filter(r => r.intent === 'High').length,
        medium_intent: results.filter(r => r.intent === 'Medium').length,
        low_intent: results.filter(r => r.intent === 'Low').length
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

/**
 * GET /results - Get scoring results
 */
function getResults(req, res) {
  try {
    const results = storage.getResults();

    if (!results || results.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No results available. Please POST to /score first'
      });
    }

    res.json({
      status: 'success',
      data: results
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

/**
 * GET /results/csv - Export results as CSV
 */
function exportResultsCSV(req, res) {
  try {
    const results = storage.getResults();

    if (!results || results.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No results available. Please POST to /score first'
      });
    }

    // Build CSV content
    const headers = 'name,role,company,industry,intent,score,reasoning\n';
    const rows = results.map(r => 
      `"${r.name}","${r.role}","${r.company}","${r.industry}","${r.intent}",${r.score},"${r.reasoning.replace(/"/g, '""')}"`
    ).join('\n');

    const csv = headers + rows;

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="lead_scores.csv"');
    res.send(csv);

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

module.exports = {
  runScoring,
  getResults,
  exportResultsCSV
};