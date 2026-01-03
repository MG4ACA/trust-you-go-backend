const { body } = require('express-validator');

/**
 * Create package request validation rules
 */
const createPackageRequestValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),

  body('no_of_days')
    .isInt({ min: 1, max: 365 })
    .withMessage('Number of days must be between 1 and 365'),

  body('no_of_travelers')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Number of travelers must be between 1 and 100'),

  body('preferred_start_date')
    .optional()
    .isISO8601()
    .withMessage('Preferred start date must be a valid date'),

  body('budget_range').optional().trim(),

  body('special_requirements').optional().trim(),
];

/**
 * Update package request status validation rules
 */
const updatePackageRequestStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'reviewing', 'approved', 'rejected'])
    .withMessage('Status must be: pending, reviewing, approved, or rejected'),

  body('admin_notes').optional().trim(),
];

/**
 * Approve package request validation rules
 */
const approvePackageRequestValidation = [
  body('package_id').notEmpty().withMessage('Package ID is required'),

  body('admin_notes').optional().trim(),
];

/**
 * Reject package request validation rules
 */
const rejectPackageRequestValidation = [
  body('admin_notes')
    .trim()
    .notEmpty()
    .withMessage('Admin notes are required when rejecting a request')
    .isLength({ min: 10 })
    .withMessage('Admin notes must be at least 10 characters'),
];

module.exports = {
  createPackageRequestValidation,
  updatePackageRequestStatusValidation,
  approvePackageRequestValidation,
  rejectPackageRequestValidation,
};
