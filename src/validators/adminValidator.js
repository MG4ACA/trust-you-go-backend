const { body } = require('express-validator');

/**
 * Create admin validation rules
 */
const createAdminValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain at least one special character (!@#$%^&*)'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),

  body('contact')
    .trim()
    .notEmpty()
    .withMessage('Contact is required')
    .isLength({ max: 50 })
    .withMessage('Contact must not exceed 50 characters'),
];

/**
 * Update admin validation rules
 */
const updateAdminValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),

  body('contact')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Contact must not exceed 50 characters'),

  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
];

module.exports = {
  createAdminValidation,
  updateAdminValidation,
};
