const express = require('express');
const router = express.Router();
const travelerController = require('../controllers/travelerController');
const { updateTravelerValidation } = require('../validators/travelerValidator');
const validate = require('../middleware/validate');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/travelers
 * @desc    Get all travelers
 * @access  Private (Admin)
 */
router.get('/', verifyToken, isAdmin, travelerController.getAllTravelers);

/**
 * @route   GET /api/travelers/:id
 * @desc    Get traveler by ID
 * @access  Private (Admin or Own Profile)
 */
router.get('/:id', verifyToken, travelerController.getTravelerById);

/**
 * @route   PUT /api/travelers/:id
 * @desc    Update traveler
 * @access  Private (Admin or Own Profile)
 */
router.put(
  '/:id',
  verifyToken,
  updateTravelerValidation,
  validate,
  travelerController.updateTraveler
);

/**
 * @route   POST /api/travelers/:id/activate
 * @desc    Activate traveler account
 * @access  Private (Admin)
 */
router.post('/:id/activate', verifyToken, isAdmin, travelerController.activateTraveler);

/**
 * @route   DELETE /api/travelers/:id
 * @desc    Delete traveler
 * @access  Private (Admin)
 */
router.delete('/:id', verifyToken, isAdmin, travelerController.deleteTraveler);

module.exports = router;
