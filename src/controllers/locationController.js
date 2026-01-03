const Location = require('../models/Location');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { buildPagination } = require('../utils/helpers');
const { deleteFile, getLocationUploadDir } = require('../services/fileService');
const path = require('path');

/**
 * Get all locations
 */
exports.getAllLocations = async (req, res) => {
  try {
    const { page = 1, limit = 10, location_type, is_active, search } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (location_type) filters.location_type = location_type;
    if (is_active !== undefined) filters.is_active = is_active === 'true';
    if (search) filters.search = search;

    const locations = await Location.findAllWithFirstImage({
      ...filters,
      limit: parseInt(limit),
      offset,
    });
    const total = await Location.count(filters);

    const pagination = buildPagination(total, parseInt(page), parseInt(limit));

    return paginatedResponse(res, locations, pagination);
  } catch (error) {
    console.error('Get locations error:', error);
    return errorResponse(res, 'Failed to get locations', 500);
  }
};

/**
 * Get location by ID
 */
exports.getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByIdWithImages(id);
    if (!location) {
      return errorResponse(res, 'Location not found', 404);
    }

    return successResponse(res, location);
  } catch (error) {
    console.error('Get location error:', error);
    return errorResponse(res, 'Failed to get location', 500);
  }
};

/**
 * Create new location
 */
exports.createLocation = async (req, res) => {
  try {
    const { name, description, location_type, location_url } = req.body;

    const locationId = await Location.create({ name, description, location_type, location_url });
    const newLocation = await Location.findByIdWithImages(locationId);

    return successResponse(res, newLocation, 'Location created successfully', 201);
  } catch (error) {
    console.error('Create location error:', error);
    return errorResponse(res, 'Failed to create location', 500);
  }
};

/**
 * Update location
 */
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const location = await Location.findById(id);
    if (!location) {
      return errorResponse(res, 'Location not found', 404);
    }

    await Location.update(id, updates);
    const updatedLocation = await Location.findByIdWithImages(id);

    return successResponse(res, updatedLocation, 'Location updated successfully');
  } catch (error) {
    console.error('Update location error:', error);
    return errorResponse(res, 'Failed to update location', 500);
  }
};

/**
 * Delete location
 */
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      return errorResponse(res, 'Location not found', 404);
    }

    // Delete all images first
    const images = await Location.getImages(id);
    for (const image of images) {
      if (image.image_url) {
        const filePath = path.join(
          process.cwd(),
          'uploads',
          image.image_url.replace('/uploads/', '')
        );
        await deleteFile(filePath);
      }
    }

    await Location.delete(id);

    return successResponse(res, null, 'Location deleted successfully');
  } catch (error) {
    console.error('Delete location error:', error);
    return errorResponse(res, 'Failed to delete location', 500);
  }
};

/**
 * Upload location image
 */
exports.uploadImage = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      return errorResponse(res, 'Location not found', 404);
    }

    if (!req.file) {
      return errorResponse(res, 'No image file provided', 400);
    }

    // Get image URL (relative path)
    const imageUrl = `/uploads/locations/${id}/${req.file.filename}`;

    // Get the highest display_order
    const images = await Location.getImages(id);
    const displayOrder =
      images.length > 0 ? Math.max(...images.map((img) => img.display_order)) + 1 : 0;

    const imageId = await Location.addImage(id, imageUrl, displayOrder);

    return successResponse(
      res,
      { image_id: imageId, image_url: imageUrl },
      'Image uploaded successfully',
      201
    );
  } catch (error) {
    console.error('Upload image error:', error);
    return errorResponse(res, 'Failed to upload image', 500);
  }
};

/**
 * Delete location image
 */
exports.deleteImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      return errorResponse(res, 'Location not found', 404);
    }

    const images = await Location.getImages(id);
    const image = images.find((img) => img.image_id === imageId);

    if (!image) {
      return errorResponse(res, 'Image not found', 404);
    }

    // Delete file from filesystem
    if (image.image_url) {
      const filePath = path.join(
        process.cwd(),
        'uploads',
        image.image_url.replace('/uploads/', '')
      );
      await deleteFile(filePath);
    }

    await Location.deleteImage(imageId);

    return successResponse(res, null, 'Image deleted successfully');
  } catch (error) {
    console.error('Delete image error:', error);
    return errorResponse(res, 'Failed to delete image', 500);
  }
};

/**
 * Reorder location images
 */
exports.reorderImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body;

    const location = await Location.findById(id);
    if (!location) {
      return errorResponse(res, 'Location not found', 404);
    }

    await Location.updateImageOrder(images);
    const updatedLocation = await Location.findByIdWithImages(id);

    return successResponse(res, updatedLocation, 'Images reordered successfully');
  } catch (error) {
    console.error('Reorder images error:', error);
    return errorResponse(res, 'Failed to reorder images', 500);
  }
};
