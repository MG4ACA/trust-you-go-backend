const Package = require('../models/Package');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { buildPagination } = require('../utils/helpers');

/**
 * Get all packages
 */
exports.getAllPackages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, is_template, is_active, search } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (status) filters.status = status;
    if (is_template !== undefined) filters.is_template = is_template === 'true';
    if (is_active !== undefined) filters.is_active = is_active === 'true';
    if (search) filters.search = search;

    const packages = await Package.findAll({ ...filters, limit: parseInt(limit), offset });
    const total = await Package.count(filters);

    const pagination = buildPagination(total, parseInt(page), parseInt(limit));

    return paginatedResponse(res, packages, pagination);
  } catch (error) {
    console.error('Get packages error:', error);
    return errorResponse(res, 'Failed to get packages', 500);
  }
};

/**
 * Get package by ID
 */
exports.getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const packageData = await Package.findByIdWithItinerary(id);
    if (!packageData) {
      return errorResponse(res, 'Package not found', 404);
    }

    return successResponse(res, packageData);
  } catch (error) {
    console.error('Get package error:', error);
    return errorResponse(res, 'Failed to get package', 500);
  }
};

/**
 * Create new package
 */
exports.createPackage = async (req, res) => {
  try {
    const { title, description, no_of_days, is_template, base_price } = req.body;
    const created_by = req.user.userId;

    const packageId = await Package.create({
      title,
      description,
      no_of_days,
      is_template,
      base_price,
      created_by,
    });

    const newPackage = await Package.findById(packageId);

    return successResponse(res, newPackage, 'Package created successfully', 201);
  } catch (error) {
    console.error('Create package error:', error);
    return errorResponse(res, 'Failed to create package', 500);
  }
};

/**
 * Update package
 */
exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const packageData = await Package.findById(id);
    if (!packageData) {
      return errorResponse(res, 'Package not found', 404);
    }

    await Package.update(id, updates);
    const updatedPackage = await Package.findByIdWithItinerary(id);

    return successResponse(res, updatedPackage, 'Package updated successfully');
  } catch (error) {
    console.error('Update package error:', error);
    return errorResponse(res, 'Failed to update package', 500);
  }
};

/**
 * Delete package
 */
exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const packageData = await Package.findById(id);
    if (!packageData) {
      return errorResponse(res, 'Package not found', 404);
    }

    await Package.delete(id);

    return successResponse(res, null, 'Package deleted successfully');
  } catch (error) {
    console.error('Delete package error:', error);
    return errorResponse(res, 'Failed to delete package', 500);
  }
};

/**
 * Update package itinerary
 */
exports.updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const { itinerary } = req.body;

    const packageData = await Package.findById(id);
    if (!packageData) {
      return errorResponse(res, 'Package not found', 404);
    }

    await Package.updateItinerary(id, itinerary);
    const updatedPackage = await Package.findByIdWithItinerary(id);

    return successResponse(res, updatedPackage, 'Itinerary updated successfully');
  } catch (error) {
    console.error('Update itinerary error:', error);
    return errorResponse(res, 'Failed to update itinerary', 500);
  }
};

/**
 * Publish package
 */
exports.publishPackage = async (req, res) => {
  try {
    const { id } = req.params;

    const packageData = await Package.findById(id);
    if (!packageData) {
      return errorResponse(res, 'Package not found', 404);
    }

    await Package.publish(id);
    const updatedPackage = await Package.findById(id);

    return successResponse(res, updatedPackage, 'Package published successfully');
  } catch (error) {
    console.error('Publish package error:', error);
    return errorResponse(res, 'Failed to publish package', 500);
  }
};

/**
 * Unpublish package
 */
exports.unpublishPackage = async (req, res) => {
  try {
    const { id } = req.params;

    const packageData = await Package.findById(id);
    if (!packageData) {
      return errorResponse(res, 'Package not found', 404);
    }

    await Package.unpublish(id);
    const updatedPackage = await Package.findById(id);

    return successResponse(res, updatedPackage, 'Package unpublished successfully');
  } catch (error) {
    console.error('Unpublish package error:', error);
    return errorResponse(res, 'Failed to unpublish package', 500);
  }
};

/**
 * Duplicate package
 */
exports.duplicatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const created_by = req.user.userId;

    const packageData = await Package.findById(id);
    if (!packageData) {
      return errorResponse(res, 'Package not found', 404);
    }

    const newPackageId = await Package.duplicate(id, title, created_by);
    const newPackage = await Package.findByIdWithItinerary(newPackageId);

    return successResponse(res, newPackage, 'Package duplicated successfully', 201);
  } catch (error) {
    console.error('Duplicate package error:', error);
    return errorResponse(res, 'Failed to duplicate package', 500);
  }
};
