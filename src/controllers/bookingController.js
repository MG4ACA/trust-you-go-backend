const Booking = require('../models/Booking');
const Traveler = require('../models/Traveler');
const Package = require('../models/Package');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { buildPagination, generateRandomPassword } = require('../utils/helpers');
const { sendBookingConfirmation } = require('../services/emailService');

/**
 * Get all bookings
 */
exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, payment_status, search } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (status) filters.status = status;
    if (payment_status) filters.payment_status = payment_status;
    if (search) filters.search = search;

    const bookings = await Booking.findAll({ ...filters, limit: parseInt(limit), offset });
    const total = await Booking.count(filters);

    const pagination = buildPagination(total, parseInt(page), parseInt(limit));

    return paginatedResponse(res, bookings, pagination);
  } catch (error) {
    console.error('Get bookings error:', error);
    return errorResponse(res, 'Failed to get bookings', 500);
  }
};

/**
 * Get booking by ID
 */
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    // Travelers can only view their own bookings
    if (req.user.role === 'traveler' && booking.traveler_id !== req.user.userId) {
      return errorResponse(res, 'Access denied', 403);
    }

    return successResponse(res, booking);
  } catch (error) {
    console.error('Get booking error:', error);
    return errorResponse(res, 'Failed to get booking', 500);
  }
};

/**
 * Get booking statistics
 */
exports.getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.getStats();
    return successResponse(res, stats);
  } catch (error) {
    console.error('Get booking stats error:', error);
    return errorResponse(res, 'Failed to get booking statistics', 500);
  }
};

/**
 * Submit booking (public endpoint)
 */
exports.submitBooking = async (req, res) => {
  try {
    const {
      package_id,
      traveler,
      no_of_travelers,
      start_date,
      end_date,
      agent_id,
      traveler_notes,
    } = req.body;

    // Check if package exists
    const packageData = await Package.findById(package_id);
    if (!packageData) {
      return errorResponse(res, 'Package not found', 404);
    }

    if (packageData.status !== 'published') {
      return errorResponse(res, 'Package is not available for booking', 400);
    }

    // Check if traveler exists by email
    let existingTraveler = await Traveler.findByEmail(traveler.email);
    let travelerId;
    let generatedPassword = null;

    if (existingTraveler) {
      travelerId = existingTraveler.traveler_id;
    } else {
      // Create new traveler account
      generatedPassword = generateRandomPassword();
      travelerId = await Traveler.create({
        email: traveler.email,
        password: generatedPassword,
        name: traveler.name,
        contact: traveler.contact,
      });
    }

    // Create booking
    const bookingId = await Booking.create({
      package_id,
      traveler_id: travelerId,
      no_of_travelers,
      start_date,
      end_date,
      agent_id,
      traveler_notes,
    });

    const newBooking = await Booking.findById(bookingId);

    return successResponse(
      res,
      {
        booking: newBooking,
        is_new_account: !!generatedPassword,
      },
      'Booking submitted successfully',
      201
    );
  } catch (error) {
    console.error('Submit booking error:', error);
    return errorResponse(res, 'Failed to submit booking', 500);
  }
};

/**
 * Update booking
 */
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    await Booking.update(id, updates);
    const updatedBooking = await Booking.findById(id);

    return successResponse(res, updatedBooking, 'Booking updated successfully');
  } catch (error) {
    console.error('Update booking error:', error);
    return errorResponse(res, 'Failed to update booking', 500);
  }
};

/**
 * Confirm booking
 */
exports.confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const confirmed_by = req.user.userId;

    const booking = await Booking.findById(id);
    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    if (booking.status === 'confirmed') {
      return errorResponse(res, 'Booking is already confirmed', 400);
    }

    // Confirm booking
    await Booking.confirm(id, confirmed_by);

    // Activate traveler account
    await Traveler.activate(booking.traveler_id);

    // Get updated booking
    const confirmedBooking = await Booking.findById(id);

    // Send confirmation email
    try {
      const traveler = await Traveler.findById(booking.traveler_id);
      await sendBookingConfirmation(traveler.email, confirmedBooking, null);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the confirmation if email fails
    }

    return successResponse(res, confirmedBooking, 'Booking confirmed successfully');
  } catch (error) {
    console.error('Confirm booking error:', error);
    return errorResponse(res, 'Failed to confirm booking', 500);
  }
};

/**
 * Cancel booking
 */
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    // Travelers can only cancel their own bookings
    if (req.user.role === 'traveler' && booking.traveler_id !== req.user.userId) {
      return errorResponse(res, 'Access denied', 403);
    }

    await Booking.cancel(id);
    const cancelledBooking = await Booking.findById(id);

    return successResponse(res, cancelledBooking, 'Booking cancelled successfully');
  } catch (error) {
    console.error('Cancel booking error:', error);
    return errorResponse(res, 'Failed to cancel booking', 500);
  }
};

/**
 * Update booking status
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    await Booking.updateStatus(id, status);
    const updatedBooking = await Booking.findById(id);

    return successResponse(res, updatedBooking, 'Booking status updated successfully');
  } catch (error) {
    console.error('Update booking status error:', error);
    return errorResponse(res, 'Failed to update booking status', 500);
  }
};

/**
 * Get traveler bookings
 */
exports.getTravelerBookings = async (req, res) => {
  try {
    const { travelerId } = req.params;

    // Travelers can only view their own bookings
    if (req.user.role === 'traveler' && req.user.userId !== travelerId) {
      return errorResponse(res, 'Access denied', 403);
    }

    const bookings = await Booking.findByTravelerId(travelerId);

    return successResponse(res, bookings);
  } catch (error) {
    console.error('Get traveler bookings error:', error);
    return errorResponse(res, 'Failed to get traveler bookings', 500);
  }
};
