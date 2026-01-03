const { body } = require('express-validator');

/**
 * Update traveler profile validation rules
 */
const updateTravelerValidation = [
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
];

module.exports = {
  updateTravelerValidation,
};
