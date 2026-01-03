const express = require('express');
const router = express.Router();
const packageRequestController = require('../controllers/packageRequestController');
const {
  createPackageRequestValidation,
  updatePackageRequestStatusValidation,
  approvePackageRequestValidation,
  rejectPackageRequestValidation,
} = require('../validators/packageRequestValidator');
const validate = require('../middleware/validate');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/package-requests
 * @desc    Create package request
 * @access  Private (Traveler)
 */
router.post(
  '/',
  verifyToken,
  createPackageRequestValidation,
  validate,
  packageRequestController.createPackageRequest
);

/**
 * @route   GET /api/package-requests/stats
 * @desc    Get package request statistics
 * @access  Private (Admin)
 */
router.get('/stats', verifyToken, isAdmin, packageRequestController.getPackageRequestStats);

/**
 * @route   GET /api/package-requests/traveler/:travelerId
 * @desc    Get traveler package requests
 * @access  Private (Admin or Own Profile)
 */
router.get(
  '/traveler/:travelerId',
  verifyToken,
  packageRequestController.getTravelerPackageRequests
);

/**
 * @route   GET /api/package-requests
 * @desc    Get all package requests
 * @access  Private (Admin)
 */
router.get('/', verifyToken, isAdmin, packageRequestController.getAllPackageRequests);

/**
 * @route   GET /api/package-requests/:id
 * @desc    Get package request by ID
 * @access  Private (Admin or Own Request)
 */
router.get('/:id', verifyToken, packageRequestController.getPackageRequestById);

/**
 * @route   PATCH /api/package-requests/:id/status
 * @desc    Update package request status
 * @access  Private (Admin)
 */
router.patch(
  '/:id/status',
  verifyToken,
  isAdmin,
  updatePackageRequestStatusValidation,
  validate,
  packageRequestController.updatePackageRequestStatus
);

/**
 * @route   POST /api/package-requests/:id/approve
 * @desc    Approve package request
 * @access  Private (Admin)
 */
router.post(
  '/:id/approve',
  verifyToken,
  isAdmin,
  approvePackageRequestValidation,
  validate,
  packageRequestController.approvePackageRequest
);

/**
 * @route   POST /api/package-requests/:id/reject
 * @desc    Reject package request
 * @access  Private (Admin)
 */
router.post(
  '/:id/reject',
  verifyToken,
  isAdmin,
  rejectPackageRequestValidation,
  validate,
  packageRequestController.rejectPackageRequest
);

module.exports = router;
