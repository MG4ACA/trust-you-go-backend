const { body } = require('express-validator');

/**
 * Create location validation rules
 */
const createLocationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),

  body('description').optional().trim(),

  body('location_type')
    .notEmpty()
    .withMessage('Location type is required')
    .isIn(['tourist_spot', 'accommodation', 'restaurant', 'activity'])
    .withMessage('Location type must be: tourist_spot, accommodation, restaurant, or activity'),

  body('location_url').optional().trim().isURL().withMessage('Location URL must be a valid URL'),
];

/**
 * Update location validation rules
 */
const updateLocationValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),

  body('description').optional().trim(),

  body('location_type')
    .optional()
    .isIn(['tourist_spot', 'accommodation', 'restaurant', 'activity'])
    .withMessage('Location type must be: tourist_spot, accommodation, restaurant, or activity'),

  body('location_url')
    .optional()
    .trim()
    .custom((value) => {
      if (value && value !== '') {
        try {
          new URL(value);
          return true;
        } catch {
          throw new Error('Location URL must be a valid URL');
        }
      }
      return true;
    }),

  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
];

/**
 * Reorder images validation rules
 */
const reorderImagesValidation = [
  body('images').isArray({ min: 1 }).withMessage('Images array is required'),

  body('images.*.image_id').notEmpty().withMessage('Image ID is required'),

  body('images.*.display_order')
    .isInt({ min: 0 })
    .withMessage('Display order must be a positive integer'),
];

module.exports = {
  createLocationValidation,
  updateLocationValidation,
  reorderImagesValidation,
};
