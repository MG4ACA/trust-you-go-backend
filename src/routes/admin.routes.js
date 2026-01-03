const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { createAdminValidation, updateAdminValidation } = require('../validators/adminValidator');
const validate = require('../middleware/validate');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(verifyToken, isAdmin);

/**
 * @route   GET /api/admins
 * @desc    Get all admins
 * @access  Private (Admin)
 */
router.get('/', adminController.getAllAdmins);

/**
 * @route   GET /api/admins/:id
 * @desc    Get admin by ID
 * @access  Private (Admin)
 */
router.get('/:id', adminController.getAdminById);

/**
 * @route   POST /api/admins
 * @desc    Create new admin
 * @access  Private (Admin)
 */
router.post('/', createAdminValidation, validate, adminController.createAdmin);

/**
 * @route   PUT /api/admins/:id
 * @desc    Update admin
 * @access  Private (Admin)
 */
router.put('/:id', updateAdminValidation, validate, adminController.updateAdmin);

/**
 * @route   DELETE /api/admins/:id
 * @desc    Delete admin (deactivate)
 * @access  Private (Admin)
 */
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
