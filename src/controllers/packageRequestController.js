const PackageRequest = require('../models/PackageRequest');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { buildPagination } = require('../utils/helpers');
const { sendPackageRequestAcknowledgment } = require('../services/emailService');
const Traveler = require('../models/Traveler');

/**
 * Get all package requests
 */
exports.getAllPackageRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;

    const requests = await PackageRequest.findAll({ ...filters, limit: parseInt(limit), offset });
    const total = await PackageRequest.count(filters);

    const pagination = buildPagination(total, parseInt(page), parseInt(limit));

    return paginatedResponse(res, requests, pagination);
  } catch (error) {
    console.error('Get package requests error:', error);
    return errorResponse(res, 'Failed to get package requests', 500);
  }
};

/**
 * Get package request by ID
 */
exports.getPackageRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await PackageRequest.findById(id);
    if (!request) {
      return errorResponse(res, 'Package request not found', 404);
    }

    // Travelers can only view their own requests
    if (req.user.role === 'traveler' && request.traveler_id !== req.user.userId) {
      return errorResponse(res, 'Access denied', 403);
    }

    return successResponse(res, request);
  } catch (error) {
    console.error('Get package request error:', error);
    return errorResponse(res, 'Failed to get package request', 500);
  }
};

/**
 * Get package request statistics
 */
exports.getPackageRequestStats = async (req, res) => {
  try {
    const stats = await PackageRequest.getStats();
    return successResponse(res, stats);
  } catch (error) {
    console.error('Get package request stats error:', error);
    return errorResponse(res, 'Failed to get package request statistics', 500);
  }
};

/**
 * Create package request
 */
exports.createPackageRequest = async (req, res) => {
  try {
    const traveler_id = req.user.userId;
    const {
      title,
      description,
      no_of_days,
      no_of_travelers,
      preferred_start_date,
      budget_range,
      special_requirements,
    } = req.body;

    const requestId = await PackageRequest.create({
      traveler_id,
      title,
      description,
      no_of_days,
      no_of_travelers,
      preferred_start_date,
      budget_range,
      special_requirements,
    });

    const newRequest = await PackageRequest.findById(requestId);

    // Send acknowledgment email
    try {
      const traveler = await Traveler.findById(traveler_id);
      await sendPackageRequestAcknowledgment(traveler.email, newRequest);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the request creation if email fails
    }

    return successResponse(res, newRequest, 'Package request submitted successfully', 201);
  } catch (error) {
    console.error('Create package request error:', error);
    return errorResponse(res, 'Failed to create package request', 500);
  }
};

/**
 * Update package request status
 */
exports.updatePackageRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const request = await PackageRequest.findById(id);
    if (!request) {
      return errorResponse(res, 'Package request not found', 404);
    }

    await PackageRequest.updateStatus(id, status, admin_notes);
    const updatedRequest = await PackageRequest.findById(id);

    return successResponse(res, updatedRequest, 'Package request status updated successfully');
  } catch (error) {
    console.error('Update package request status error:', error);
    return errorResponse(res, 'Failed to update package request status', 500);
  }
};

/**
 * Approve package request
 */
exports.approvePackageRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { package_id, admin_notes } = req.body;

    const request = await PackageRequest.findById(id);
    if (!request) {
      return errorResponse(res, 'Package request not found', 404);
    }

    if (request.status === 'approved') {
      return errorResponse(res, 'Package request is already approved', 400);
    }

    await PackageRequest.approve(id, package_id, admin_notes);
    const approvedRequest = await PackageRequest.findById(id);

    return successResponse(res, approvedRequest, 'Package request approved successfully');
  } catch (error) {
    console.error('Approve package request error:', error);
    return errorResponse(res, 'Failed to approve package request', 500);
  }
};

/**
 * Reject package request
 */
exports.rejectPackageRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;

    const request = await PackageRequest.findById(id);
    if (!request) {
      return errorResponse(res, 'Package request not found', 404);
    }

    if (request.status === 'rejected') {
      return errorResponse(res, 'Package request is already rejected', 400);
    }

    await PackageRequest.reject(id, admin_notes);
    const rejectedRequest = await PackageRequest.findById(id);

    return successResponse(res, rejectedRequest, 'Package request rejected');
  } catch (error) {
    console.error('Reject package request error:', error);
    return errorResponse(res, 'Failed to reject package request', 500);
  }
};

/**
 * Get traveler package requests
 */
exports.getTravelerPackageRequests = async (req, res) => {
  try {
    const { travelerId } = req.params;

    // Travelers can only view their own requests
    if (req.user.role === 'traveler' && req.user.userId !== travelerId) {
      return errorResponse(res, 'Access denied', 403);
    }

    const requests = await PackageRequest.findByTravelerId(travelerId);

    return successResponse(res, requests);
  } catch (error) {
    console.error('Get traveler package requests error:', error);
    return errorResponse(res, 'Failed to get traveler package requests', 500);
  }
};
