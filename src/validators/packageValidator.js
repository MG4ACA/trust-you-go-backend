const { body } = require('express-validator');

/**
 * Create package validation rules
 */
const createPackageValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),

  body('description').optional().trim(),

  body('no_of_days')
    .isInt({ min: 1, max: 365 })
    .withMessage('Number of days must be between 1 and 365'),

  body('is_template').optional().isBoolean().withMessage('is_template must be a boolean'),

  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be: draft or published'),

  body('base_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
];

/**
 * Update package validation rules
 */
const updatePackageValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),

  body('description').optional().trim(),

  body('no_of_days')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Number of days must be between 1 and 365'),

  body('is_template').optional().isBoolean().withMessage('is_template must be a boolean'),

  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be: draft or published'),

  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),

  body('base_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
];

/**
 * Update itinerary validation rules
 */
const updateItineraryValidation = [
  body('itinerary').isArray({ min: 1 }).withMessage('Itinerary array is required'),

  body('itinerary.*.location_id').notEmpty().withMessage('Location ID is required'),

  body('itinerary.*.day_number')
    .isInt({ min: 1 })
    .withMessage('Day number must be a positive integer'),

  body('itinerary.*.visit_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Visit order must be a non-negative integer'),

  body('itinerary.*.notes').optional().trim(),
];

/**
 * Duplicate package validation rules
 */
const duplicatePackageValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('New title is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
];

module.exports = {
  createPackageValidation,
  updatePackageValidation,
  updateItineraryValidation,
  duplicatePackageValidation,
};
