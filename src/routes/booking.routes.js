const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const {
  submitBookingValidation,
  updateBookingValidation,
  updateBookingStatusValidation,
} = require('../validators/bookingValidator');
const validate = require('../middleware/validate');
const { verifyToken, isAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/bookings/submit
 * @desc    Submit booking (public endpoint)
 * @access  Public
 */
router.post('/submit', submitBookingValidation, validate, bookingController.submitBooking);

/**
 * @route   GET /api/bookings/stats
 * @desc    Get booking statistics
 * @access  Private (Admin)
 */
router.get('/stats', verifyToken, isAdmin, bookingController.getBookingStats);

/**
 * @route   GET /api/bookings/traveler/:travelerId
 * @desc    Get traveler bookings
 * @access  Private (Admin or Own Profile)
 */
router.get('/traveler/:travelerId', verifyToken, bookingController.getTravelerBookings);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings
 * @access  Private (Admin)
 */
router.get('/', verifyToken, isAdmin, bookingController.getAllBookings);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking by ID
 * @access  Private (Admin or Own Booking)
 */
router.get('/:id', verifyToken, bookingController.getBookingById);

/**
 * @route   PUT /api/bookings/:id
 * @desc    Update booking
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  updateBookingValidation,
  validate,
  bookingController.updateBooking
);

/**
 * @route   POST /api/bookings/:id/confirm
 * @desc    Confirm booking
 * @access  Private (Admin)
 */
router.post('/:id/confirm', verifyToken, isAdmin, bookingController.confirmBooking);

/**
 * @route   POST /api/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private (Admin or Own Booking)
 */
router.post('/:id/cancel', verifyToken, bookingController.cancelBooking);

/**
 * @route   PATCH /api/bookings/:id/status
 * @desc    Update booking status
 * @access  Private (Admin)
 */
router.patch(
  '/:id/status',
  verifyToken,
  isAdmin,
  updateBookingStatusValidation,
  validate,
  bookingController.updateBookingStatus
);

module.exports = router;
