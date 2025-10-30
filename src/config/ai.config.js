module.exports = {
  apiKey: process.env.AI_API_KEY,
  model: process.env.AI_MODEL || 'openai/gpt-oss-20b:free',
  baseURL: 'https://openrouter.ai/api/v1',
  
  // AI prompt template for lead scoring
  getPrompt: (lead, offer) => {
    return `You are a B2B lead qualification expert. Analyze this prospect against the product offering.

PRODUCT/OFFER:
- Name: ${offer.name}
- Value Propositions: ${offer.value_props.join(', ')}
- Ideal Use Cases: ${offer.ideal_use_cases.join(', ')}

PROSPECT:
- Name: ${lead.name}
- Role: ${lead.role}
- Company: ${lead.company}
- Industry: ${lead.industry}
- Location: ${lead.location}
- LinkedIn Bio: ${lead.linkedin_bio || 'Not provided'}

TASK:
Classify this prospect's buying intent as High, Medium, or Low based on:
1. Role relevance to the product
2. Industry fit with ideal use cases
3. Likelihood they face problems this product solves
4. Decision-making authority

Respond in JSON format:
{
  "intent": "High|Medium|Low",
  "reasoning": "One clear sentence explaining why"
}`;
  }
};