const Admin = require('../models/Admin');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { buildPagination } = require('../utils/helpers');

/**
 * Get all admins
 */
exports.getAllAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 10, is_active, search } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (is_active !== undefined) filters.is_active = is_active === 'true';
    if (search) filters.search = search;

    const admins = await Admin.findAll({ ...filters, limit: parseInt(limit), offset });
    const total = await Admin.count(filters);

    const pagination = buildPagination(total, parseInt(page), parseInt(limit));

    return paginatedResponse(res, admins, pagination);
  } catch (error) {
    console.error('Get admins error:', error);
    return errorResponse(res, 'Failed to get admins', 500);
  }
};

/**
 * Get admin by ID
 */
exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
      return errorResponse(res, 'Admin not found', 404);
    }

    return successResponse(res, admin);
  } catch (error) {
    console.error('Get admin error:', error);
    return errorResponse(res, 'Failed to get admin', 500);
  }
};

/**
 * Create new admin
 */
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, name, contact } = req.body;

    // Check if email already exists
    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return errorResponse(res, 'Email already exists', 400);
    }

    const adminId = await Admin.create({ email, password, name, contact });
    const newAdmin = await Admin.findById(adminId);

    return successResponse(res, newAdmin, 'Admin created successfully', 201);
  } catch (error) {
    console.error('Create admin error:', error);
    return errorResponse(res, 'Failed to create admin', 500);
  }
};

/**
 * Update admin
 */
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return errorResponse(res, 'Admin not found', 404);
    }

    await Admin.update(id, updates);
    const updatedAdmin = await Admin.findById(id);

    return successResponse(res, updatedAdmin, 'Admin updated successfully');
  } catch (error) {
    console.error('Update admin error:', error);
    return errorResponse(res, 'Failed to update admin', 500);
  }
};

/**
 * Delete admin (deactivate)
 */
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
      return errorResponse(res, 'Admin not found', 404);
    }

    // Prevent self-deletion
    if (id === req.user.userId) {
      return errorResponse(res, 'Cannot delete your own account', 400);
    }

    await Admin.deactivate(id);

    return successResponse(res, null, 'Admin deactivated successfully');
  } catch (error) {
    console.error('Delete admin error:', error);
    return errorResponse(res, 'Failed to delete admin', 500);
  }
};
