const storage = require('../utils/storage');
const { parseCSV } = require('../services/csv.service');

async function uploadLeads(req, res) {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No CSV file uploaded. Use field name "file"'
      });
    }

    // Check file type
    if (!req.file.originalname.endsWith('.csv')) {
      return res.status(400).json({
        status: 'error',
        message: 'Only CSV files are allowed'
      });
    }

    // Parse CSV file
    const { leads, errors } = await parseCSV(req.file.path);

    // Store leads
    storage.setLeads(leads);

    res.json({
      status: 'success',
      message: 'Leads uploaded successfully',
      data: {
        total_leads: leads.length,
        parsing_warnings: errors
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

module.exports = {
  uploadLeads
};