const jwt = require('jsonwebtoken');
const config = require('../config');

// Verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

// Check if user is traveler
const isTraveler = (req, res, next) => {
  if (!req.user || req.user.role !== 'traveler') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Traveler role required.'
    });
  }
  next();
};

// Check if user is admin or traveler
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isTraveler,
  isAuthenticated
};
