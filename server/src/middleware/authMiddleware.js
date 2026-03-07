const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware: Verify JSON Web Token
 * 
 * This checks if a valid JWT is present in the Authorization header.
 * If valid, it attaches the decoded user info to the 'req.user' object.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the "Authorization" header and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get the token by splitting 'Bearer <token>'
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // We attach the decoded user info (usually an ID and Role) to the request
      // In a full application, you might fetch the user from the database here
      req.user = decoded;

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token was found
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
};

/**
 * Role-Based Authorization Middleware
 * 
 * Used after the 'protect' middleware to ensure the user has the required roles.
 * Example usage: authorize('admin', 'teacher')
 * 
 * @param  {...string} roles - The roles allowed to access the route
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // 403 Forbidden
      throw new Error(`User role '${req.user ? req.user.role : 'Unknown'}' is not authorized to access this route`);
    }
    next(); // Valid role, proceed
  };
};

module.exports = { protect, authorize };
