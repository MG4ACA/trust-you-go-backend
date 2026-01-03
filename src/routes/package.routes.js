const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const {
  createPackageValidation,
  updatePackageValidation,
  updateItineraryValidation,
  duplicatePackageValidation,
} = require('../validators/packageValidator');
const validate = require('../middleware/validate');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/packages
 * @desc    Get all packages
 * @access  Public
 */
router.get('/', packageController.getAllPackages);

/**
 * @route   GET /api/packages/:id
 * @desc    Get package by ID
 * @access  Public
 */
router.get('/:id', packageController.getPackageById);

/**
 * @route   POST /api/packages
 * @desc    Create new package
 * @access  Private (Admin)
 */
router.post(
  '/',
  verifyToken,
  isAdmin,
  createPackageValidation,
  validate,
  packageController.createPackage
);

/**
 * @route   PUT /api/packages/:id
 * @desc    Update package
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  updatePackageValidation,
  validate,
  packageController.updatePackage
);

/**
 * @route   DELETE /api/packages/:id
 * @desc    Delete package
 * @access  Private (Admin)
 */
router.delete('/:id', verifyToken, isAdmin, packageController.deletePackage);

/**
 * @route   PUT /api/packages/:id/itinerary
 * @desc    Update package itinerary
 * @access  Private (Admin)
 */
router.put(
  '/:id/itinerary',
  verifyToken,
  isAdmin,
  updateItineraryValidation,
  validate,
  packageController.updateItinerary
);

/**
 * @route   POST /api/packages/:id/publish
 * @desc    Publish package
 * @access  Private (Admin)
 */
router.post('/:id/publish', verifyToken, isAdmin, packageController.publishPackage);

/**
 * @route   POST /api/packages/:id/unpublish
 * @desc    Unpublish package
 * @access  Private (Admin)
 */
router.post('/:id/unpublish', verifyToken, isAdmin, packageController.unpublishPackage);

/**
 * @route   POST /api/packages/:id/duplicate
 * @desc    Duplicate package
 * @access  Private (Admin)
 */
router.post(
  '/:id/duplicate',
  verifyToken,
  isAdmin,
  duplicatePackageValidation,
  validate,
  packageController.duplicatePackage
);

module.exports = router;
