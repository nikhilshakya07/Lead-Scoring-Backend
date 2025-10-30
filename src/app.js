const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Lead Scoring API is running',
    endpoints: {
      'POST /offer': 'Submit product/offer details',
      'POST /leads/upload': 'Upload leads CSV file',
      'POST /score': 'Run scoring on uploaded leads',
      'GET /results': 'Get scoring results',
      'GET /results/csv': 'Export results as CSV'
    }
  });
});

// API Routes
app.use('/', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

module.exports = app;