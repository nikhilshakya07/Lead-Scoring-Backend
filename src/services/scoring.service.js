const { isLeadComplete } = require('../utils/validator');

function calculateRuleScore(lead, offer) {
  let score = 0;
  const breakdown = {};

  // 1. ROLE RELEVANCE (0-20 points)
  score += scoreRole(lead.role, breakdown);

  // 2. INDUSTRY MATCH (0-20 points)
  score += scoreIndustry(lead.industry, offer.ideal_use_cases, breakdown);

  // 3. DATA COMPLETENESS (0-10 points)
  score += scoreCompleteness(lead, breakdown);

  return { score, breakdown };
}

/**
 * Score based on role (decision maker vs influencer)
 */
function scoreRole(role, breakdown) {
  const roleLower = role.toLowerCase();
  
  // Decision makers - 20 points
  const decisionMakers = [
    'ceo', 'cto', 'cfo', 'coo', 'chief', 'president', 'owner',
    'founder', 'director', 'vp', 'vice president', 'head of'
  ];
  
  // Influencers - 10 points
  const influencers = [
    'manager', 'lead', 'coordinator', 'specialist', 'senior'
  ];

  for (const title of decisionMakers) {
    if (roleLower.includes(title)) {
      breakdown.role = { points: 20, reason: 'Decision maker' };
      return 20;
    }
  }

  for (const title of influencers) {
    if (roleLower.includes(title)) {
      breakdown.role = { points: 10, reason: 'Influencer' };
      return 10;
    }
  }

  breakdown.role = { points: 0, reason: 'Non-decision maker' };
  return 0;
}

/**
 * Score based on industry match with ideal use cases
 */
function scoreIndustry(industry, idealUseCases, breakdown) {
  const industryLower = industry.toLowerCase();
  
  for (const useCase of idealUseCases) {
    const useCaseLower = useCase.toLowerCase();
    
    // Extract keywords from use case
    const keywords = useCaseLower.split(/\s+/);
    
    // Check for exact match
    if (industryLower.includes(useCaseLower) || useCaseLower.includes(industryLower)) {
      breakdown.industry = { points: 20, reason: 'Exact ICP match' };
      return 20;
    }
    
    // Check for partial match (any keyword)
    for (const keyword of keywords) {
      if (keyword.length > 3 && industryLower.includes(keyword)) {
        breakdown.industry = { points: 10, reason: 'Adjacent industry' };
        return 10;
      }
    }
  }

  breakdown.industry = { points: 0, reason: 'No industry match' };
  return 0;
}

/**
 * Score based on data completeness
 */
function scoreCompleteness(lead, breakdown) {
  if (isLeadComplete(lead)) {
    breakdown.completeness = { points: 10, reason: 'All fields present' };
    return 10;
  }
  
  breakdown.completeness = { points: 0, reason: 'Missing fields' };
  return 0;
}

/**
 * Convert total score to intent label
 */
function getIntentLabel(totalScore) {
  if (totalScore >= 70) return 'High';
  if (totalScore >= 40) return 'Medium';
  return 'Low';
}

module.exports = {
  calculateRuleScore,
  getIntentLabel
};