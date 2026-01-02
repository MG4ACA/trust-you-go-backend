const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate JWT token
 * @param {object} payload - Token payload (user data)
 * @returns {string} - JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} - Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {object} - Decoded token payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Generate admin token
 * @param {object} admin - Admin user object
 * @returns {string} - JWT token
 */
const generateAdminToken = (admin) => {
  return generateToken({
    userId: admin.admin_id,
    email: admin.email,
    role: 'admin',
    name: admin.name,
  });
};

/**
 * Generate traveler token
 * @param {object} traveler - Traveler user object
 * @returns {string} - JWT token
 */
const generateTravelerToken = (traveler) => {
  return generateToken({
    userId: traveler.traveler_id,
    email: traveler.email,
    role: 'traveler',
    name: traveler.name,
  });
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  generateAdminToken,
  generateTravelerToken,
};
