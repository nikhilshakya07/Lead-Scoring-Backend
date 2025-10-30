const axios = require('axios');
const config = require('../config/ai.config');

async function getAIScore(lead, offer) {
  try {
    const prompt = config.getPrompt(lead, offer);

    const response = await axios.post(
      `${config.baseURL}/chat/completions`,
      {
        model: config.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', 
          'X-Title': 'Lead Scoring System' 
        }
      }
    );

    // Parse AI response
    const aiMessage = response.data.choices[0].message.content;
    const aiResult = parseAIResponse(aiMessage);

    // Map intent to points
    const pointsMap = {
      'High': 50,
      'Medium': 30,
      'Low': 10
    };

    return {
      intent: aiResult.intent,
      reasoning: aiResult.reasoning,
      points: pointsMap[aiResult.intent] || 10
    };

  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    
    // Fallback to Medium with generic reasoning if AI fails
    return {
      intent: 'Medium',
      reasoning: 'AI analysis unavailable, assigned default score',
      points: 30
    };
  }
}

/**
 * Parse AI response to extract intent and reasoning
 */
function parseAIResponse(aiMessage) {
  try {
    // Try to parse as JSON first
    const jsonMatch = aiMessage.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        intent: parsed.intent || 'Medium',
        reasoning: parsed.reasoning || 'No reasoning provided'
      };
    }

    // Fallback: look for intent keywords
    const messageLower = aiMessage.toLowerCase();
    let intent = 'Medium';
    
    if (messageLower.includes('high') && messageLower.indexOf('high') < 50) {
      intent = 'High';
    } else if (messageLower.includes('low') && messageLower.indexOf('low') < 50) {
      intent = 'Low';
    }

    return {
      intent,
      reasoning: aiMessage.substring(0, 200) // First 200 chars as reasoning
    };

  } catch (error) {
    console.error('Failed to parse AI response:', error.message);
    return {
      intent: 'Medium',
      reasoning: 'Unable to parse AI response'
    };
  }
}

module.exports = {
  getAIScore
};