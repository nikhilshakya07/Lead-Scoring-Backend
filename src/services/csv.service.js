const fs = require('fs');
const csv = require('csv-parser');

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const leads = [];
    const errors = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Trim whitespace from all values
        const lead = {
          name: row.name?.trim() || '',
          role: row.role?.trim() || '',
          company: row.company?.trim() || '',
          industry: row.industry?.trim() || '',
          location: row.location?.trim() || '',
          linkedin_bio: row.linkedin_bio?.trim() || ''
        };

        // Basic validation - at least name should exist
        if (lead.name) {
          leads.push(lead);
        } else {
          errors.push(`Skipped row with missing name`);
        }
      })
      .on('end', () => {
        // Delete uploaded file after parsing
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete temp file:', err);
        });

        if (leads.length === 0) {
          reject(new Error('No valid leads found in CSV'));
        } else {
          resolve({ leads, errors });
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = {
  parseCSV
};