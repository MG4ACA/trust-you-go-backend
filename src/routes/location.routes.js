const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const {
  createLocationValidation,
  updateLocationValidation,
  reorderImagesValidation,
} = require('../validators/locationValidator');
const validate = require('../middleware/validate');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { uploadLocationImage } = require('../middleware/upload');

/**
 * @route   GET /api/locations
 * @desc    Get all locations
 * @access  Public
 */
router.get('/', locationController.getAllLocations);

/**
 * @route   GET /api/locations/:id
 * @desc    Get location by ID
 * @access  Public
 */
router.get('/:id', locationController.getLocationById);

/**
 * @route   POST /api/locations
 * @desc    Create new location
 * @access  Private (Admin)
 */
router.post(
  '/',
  verifyToken,
  isAdmin,
  createLocationValidation,
  validate,
  locationController.createLocation
);

/**
 * @route   PUT /api/locations/:id
 * @desc    Update location
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  updateLocationValidation,
  validate,
  locationController.updateLocation
);

/**
 * @route   DELETE /api/locations/:id
 * @desc    Delete location
 * @access  Private (Admin)
 */
router.delete('/:id', verifyToken, isAdmin, locationController.deleteLocation);

/**
 * @route   POST /api/locations/:id/images
 * @desc    Upload location image
 * @access  Private (Admin)
 */
router.post(
  '/:id/images',
  verifyToken,
  isAdmin,
  uploadLocationImage.single('image'),
  locationController.uploadImage
);

/**
 * @route   PUT /api/locations/:id/images/reorder
 * @desc    Reorder location images
 * @access  Private (Admin)
 */
router.put(
  '/:id/images/reorder',
  verifyToken,
  isAdmin,
  reorderImagesValidation,
  validate,
  locationController.reorderImages
);

/**
 * @route   DELETE /api/locations/:id/images/:imageId
 * @desc    Delete location image
 * @access  Private (Admin)
 */
router.delete('/:id/images/:imageId', verifyToken, isAdmin, locationController.deleteImage);

module.exports = router;
