const jwt = require('jsonwebtoken');

/**
 * Utility to generate a signed JSON Web Token (JWT)
 * 
 * This token will be sent to the client upon successful login
 * and should be used by the client for subsequent authorized requests.
 * 
 * @param {string} id - The unique user ID
 * @param {string} role - The user's role (admin, teacher, student)
 * @returns {string} - The generated JWT token
 */
const generateToken = (id, role) => {
  // Sign the token with the secret key and set an expiration time (e.g., 30 days)
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
