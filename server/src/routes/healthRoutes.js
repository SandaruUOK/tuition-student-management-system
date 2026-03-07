const express = require('express');
const router = express.Router();
const { getHealthStatus } = require('../controllers/healthController');

// Route: GET /api/health
// Purpose: Health check endpoint
router.get('/', getHealthStatus);

module.exports = router;
