/**
 * Centralized Error Handling Middleware
 * 
 * This middleware catches any errors thrown in routes or controllers
 * and formats them into a standardized JSON response.
 * 
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Determine the status code. If it's still 200 after an error, it usually means 
  // it was an unexpected server error, so default to 500 (Internal Server Error).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Set the response status code
  res.status(statusCode);
  
  // Send the error details back to the client
  res.json({
    message: err.message,
    // Include stack trace only in development environment to avoid exposing sensitive code paths
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
