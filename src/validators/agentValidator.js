const { body } = require('express-validator');

/**
 * Create agent validation rules
 */
const createAgentValidation = [
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

  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),

  body('commission_rate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Commission rate must be between 0 and 100'),

  body('notes').optional().trim(),
];

/**
 * Update agent validation rules
 */
const updateAgentValidation = [
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

  body('email').optional().trim().isEmail().withMessage('Valid email is required').normalizeEmail(),

  body('commission_rate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Commission rate must be between 0 and 100'),

  body('notes').optional().trim(),

  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
];

module.exports = {
  createAgentValidation,
  updateAgentValidation,
};
