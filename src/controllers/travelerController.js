const Traveler = require('../models/Traveler');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { buildPagination } = require('../utils/helpers');

/**
 * Get all travelers
 */
exports.getAllTravelers = async (req, res) => {
  try {
    const { page = 1, limit = 10, is_active, search } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (is_active !== undefined) filters.is_active = is_active === 'true';
    if (search) filters.search = search;

    const travelers = await Traveler.findAll({ ...filters, limit: parseInt(limit), offset });
    const total = await Traveler.count(filters);

    const pagination = buildPagination(total, parseInt(page), parseInt(limit));

    return paginatedResponse(res, travelers, pagination);
  } catch (error) {
    console.error('Get travelers error:', error);
    return errorResponse(res, 'Failed to get travelers', 500);
  }
};

/**
 * Get traveler by ID
 */
exports.getTravelerById = async (req, res) => {
  try {
    const { id } = req.params;

    const traveler = await Traveler.findById(id);
    if (!traveler) {
      return errorResponse(res, 'Traveler not found', 404);
    }

    return successResponse(res, traveler);
  } catch (error) {
    console.error('Get traveler error:', error);
    return errorResponse(res, 'Failed to get traveler', 500);
  }
};

/**
 * Update traveler
 */
exports.updateTraveler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Travelers can only update their own profile
    if (req.user.role === 'traveler' && req.user.userId !== id) {
      return errorResponse(res, 'You can only update your own profile', 403);
    }

    const traveler = await Traveler.findById(id);
    if (!traveler) {
      return errorResponse(res, 'Traveler not found', 404);
    }

    // Check email uniqueness if being updated
    if (updates.email && updates.email !== traveler.email) {
      const existingTraveler = await Traveler.findByEmail(updates.email);
      if (existingTraveler) {
        return errorResponse(res, 'Email already exists', 400);
      }
    }

    await Traveler.update(id, updates);
    const updatedTraveler = await Traveler.findById(id);

    return successResponse(res, updatedTraveler, 'Profile updated successfully');
  } catch (error) {
    console.error('Update traveler error:', error);
    return errorResponse(res, 'Failed to update traveler', 500);
  }
};

/**
 * Activate traveler account
 */
exports.activateTraveler = async (req, res) => {
  try {
    const { id } = req.params;

    const traveler = await Traveler.findById(id);
    if (!traveler) {
      return errorResponse(res, 'Traveler not found', 404);
    }

    if (traveler.is_active) {
      return errorResponse(res, 'Traveler is already active', 400);
    }

    await Traveler.activate(id);
    const updatedTraveler = await Traveler.findById(id);

    return successResponse(res, updatedTraveler, 'Traveler activated successfully');
  } catch (error) {
    console.error('Activate traveler error:', error);
    return errorResponse(res, 'Failed to activate traveler', 500);
  }
};

/**
 * Delete traveler
 */
exports.deleteTraveler = async (req, res) => {
  try {
    const { id } = req.params;

    const traveler = await Traveler.findById(id);
    if (!traveler) {
      return errorResponse(res, 'Traveler not found', 404);
    }

    await Traveler.delete(id);

    return successResponse(res, null, 'Traveler deleted successfully');
  } catch (error) {
    console.error('Delete traveler error:', error);
    return errorResponse(res, 'Failed to delete traveler', 500);
  }
};
