function validateOffer(offer) {
  const errors = [];

  if (!offer.name || typeof offer.name !== 'string') {
    errors.push('Offer name is required and must be a string');
  }

  if (!Array.isArray(offer.value_props) || offer.value_props.length === 0) {
    errors.push('value_props must be a non-empty array');
  }

  if (!Array.isArray(offer.ideal_use_cases) || offer.ideal_use_cases.length === 0) {
    errors.push('ideal_use_cases must be a non-empty array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate lead data structure
 */
function validateLead(lead) {
  const requiredFields = ['name', 'role', 'company', 'industry', 'location'];
  const missingFields = requiredFields.filter(field => !lead[field]);

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Check if lead has all fields (for completeness bonus)
 */
function isLeadComplete(lead) {
  const allFields = ['name', 'role', 'company', 'industry', 'location', 'linkedin_bio'];
  return allFields.every(field => lead[field] && lead[field].trim() !== '');
}

module.exports = {
  validateOffer,
  validateLead,
  isLeadComplete
};