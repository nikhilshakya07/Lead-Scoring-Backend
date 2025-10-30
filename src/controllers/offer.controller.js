const storage = require('../utils/storage');
const { validateOffer } = require('../utils/validator');

async function submitOffer(req, res) {
  try {
    const offerData = req.body;

    // Validate offer data
    const validation = validateOffer(offerData);
    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid offer data',
        errors: validation.errors
      });
    }

    // Store offer
    storage.setOffer(offerData);

    res.json({
      status: 'success',
      message: 'Offer submitted successfully',
      data: offerData
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

module.exports = {
  submitOffer
};