/**
 * @desc    Health Check API
 * @route   GET /api/health
 * @access  Public
 * 
 * Responds with a generic success message to confirm the API is functioning properly.
 */
const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running properly and healthy!',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};
