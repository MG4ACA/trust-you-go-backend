const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginValidation, changePasswordValidation } = require('../validators/authValidator');
const validate = require('../middleware/validate');
const { verifyToken } = require('../middleware/auth');

/**
 * @route   POST /api/auth/login
 * @desc    Login for admin and traveler
 * @access  Public
 */
router.post('/login', loginValidation, validate, authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', verifyToken, authController.getMe);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.post(
  '/change-password',
  verifyToken,
  changePasswordValidation,
  validate,
  authController.changePassword
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (optional)
 * @access  Private
 */
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
