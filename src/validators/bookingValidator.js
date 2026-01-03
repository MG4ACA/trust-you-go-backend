const { body } = require('express-validator');

/**
 * Submit booking validation rules (public endpoint)
 */
const submitBookingValidation = [
  body('package_id').notEmpty().withMessage('Package ID is required'),

  body('traveler.name')
    .trim()
    .notEmpty()
    .withMessage('Traveler name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),

  body('traveler.email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),

  body('traveler.contact')
    .trim()
    .notEmpty()
    .withMessage('Contact is required')
    .isLength({ max: 50 })
    .withMessage('Contact must not exceed 50 characters'),

  body('no_of_travelers')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Number of travelers must be between 1 and 100'),

  body('start_date').optional().isISO8601().withMessage('Start date must be a valid date'),

  body('end_date').optional().isISO8601().withMessage('End date must be a valid date'),

  body('agent_id').optional(),

  body('traveler_notes').optional().trim(),
];

/**
 * Update booking validation rules
 */
const updateBookingValidation = [
  body('no_of_travelers')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Number of travelers must be between 1 and 100'),

  body('start_date').optional().isISO8601().withMessage('Start date must be a valid date'),

  body('end_date').optional().isISO8601().withMessage('End date must be a valid date'),

  body('total_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),

  body('payment_status')
    .optional()
    .isIn(['pending', 'partial', 'paid', 'refunded'])
    .withMessage('Payment status must be: pending, partial, paid, or refunded'),

  body('agent_id').optional(),

  body('admin_notes').optional().trim(),

  body('traveler_notes').optional().trim(),
];

/**
 * Update booking status validation rules
 */
const updateBookingStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['temporary', 'confirmed', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be: temporary, confirmed, in_progress, completed, or cancelled'),
];

module.exports = {
  submitBookingValidation,
  updateBookingValidation,
  updateBookingStatusValidation,
};
