const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const offerController = require('../controllers/offer.controller');
const leadsController = require('../controllers/leads.controller');
const scoreController = require('../controllers/score.controller');

const router = express.Router();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Routes
router.post('/offer', offerController.submitOffer);
router.post('/leads/upload', upload.single('file'), leadsController.uploadLeads);
router.post('/score', scoreController.runScoring);
router.get('/results', scoreController.getResults);
router.get('/results/csv', scoreController.exportResultsCSV);

module.exports = router;