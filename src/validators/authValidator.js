const { body } = require('express-validator');

/**
 * Login validation rules
 */
const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Change password validation rules
 */
const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .matches(/[!@#$%^&*]/)
    .withMessage('New password must contain at least one special character (!@#$%^&*)'),

  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match');
    }
    return true;
  }),
];

module.exports = {
  loginValidation,
  changePasswordValidation,
};
