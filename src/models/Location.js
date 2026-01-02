const { query, transaction } = require('../config/database');
const { generateUUID } = require('../utils/helpers');

class Location {
  /**
   * Find location by ID
   */
  static async findById(locationId) {
    const sql = `
      SELECT location_id, name, description, location_type, location_url, is_active, created_at, updated_at 
      FROM locations 
      WHERE location_id = ?
    `;
    const results = await query(sql, [locationId]);
    return results[0];
  }

  /**
   * Find location by ID with images
   */
  static async findByIdWithImages(locationId) {
    const location = await this.findById(locationId);

    if (!location) {
      return null;
    }

    const imagesSql = `
      SELECT image_id, image_url, thumbnail_url, display_order, uploaded_at 
      FROM location_images 
      WHERE location_id = ? 
      ORDER BY display_order ASC, uploaded_at ASC
    `;
    const images = await query(imagesSql, [locationId]);

    location.images = images;
    return location;
  }

  /**
   * Get all locations with filters
   */
  static async findAll(filters = {}) {
    let sql = `
      SELECT location_id, name, description, location_type, location_url, is_active, created_at, updated_at 
      FROM locations 
      WHERE 1=1
    `;
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.location_type) {
      sql += ' AND location_type = ?';
      params.push(filters.location_type);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY name ASC';

    const results = await query(sql, params);
    return results;
  }

  /**
   * Get all locations with their first image
   */
  static async findAllWithFirstImage(filters = {}) {
    let sql = `
      SELECT 
        l.location_id, 
        l.name, 
        l.description, 
        l.location_type, 
        l.location_url, 
        l.is_active, 
        l.created_at, 
        l.updated_at,
        (SELECT image_url FROM location_images WHERE location_id = l.location_id ORDER BY display_order ASC, uploaded_at ASC LIMIT 1) as image_url,
        (SELECT thumbnail_url FROM location_images WHERE location_id = l.location_id ORDER BY display_order ASC, uploaded_at ASC LIMIT 1) as thumbnail_url
      FROM locations l 
      WHERE 1=1
    `;
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ' AND l.is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.location_type) {
      sql += ' AND l.location_type = ?';
      params.push(filters.location_type);
    }

    if (filters.search) {
      sql += ' AND (l.name LIKE ? OR l.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY l.name ASC';

    const results = await query(sql, params);
    return results;
  }

  /**
   * Create new location
   */
  static async create(data) {
    const locationId = generateUUID();

    const sql = `
      INSERT INTO locations (location_id, name, description, location_type, location_url) 
      VALUES (?, ?, ?, ?, ?)
    `;

    await query(sql, [
      locationId,
      data.name,
      data.description || null,
      data.location_type,
      data.location_url || null,
    ]);

    return this.findById(locationId);
  }

  /**
   * Update location details
   */
  static async update(locationId, data) {
    const updates = [];
    const params = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name);
    }

    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description);
    }

    if (data.location_type !== undefined) {
      updates.push('location_type = ?');
      params.push(data.location_type);
    }

    if (data.location_url !== undefined) {
      updates.push('location_url = ?');
      params.push(data.location_url);
    }

    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(data.is_active);
    }

    if (updates.length === 0) {
      return this.findById(locationId);
    }

    params.push(locationId);
    const sql = `UPDATE locations SET ${updates.join(', ')} WHERE location_id = ?`;

    await query(sql, params);
    return this.findById(locationId);
  }

  /**
   * Soft delete (deactivate) location
   */
  static async deactivate(locationId) {
    const sql = 'UPDATE locations SET is_active = FALSE WHERE location_id = ?';
    await query(sql, [locationId]);
    return { success: true };
  }

  /**
   * Add image to location
   */
  static async addImage(locationId, imageData) {
    const imageId = generateUUID();

    const sql = `
      INSERT INTO location_images (image_id, location_id, image_url, thumbnail_url, display_order) 
      VALUES (?, ?, ?, ?, ?)
    `;

    await query(sql, [
      imageId,
      locationId,
      imageData.image_url,
      imageData.thumbnail_url || null,
      imageData.display_order || 0,
    ]);

    const results = await query('SELECT * FROM location_images WHERE image_id = ?', [imageId]);
    return results[0];
  }

  /**
   * Delete image from location
   */
  static async deleteImage(imageId) {
    const sql = 'DELETE FROM location_images WHERE image_id = ?';
    await query(sql, [imageId]);
    return { success: true };
  }

  /**
   * Get all images for a location
   */
  static async getImages(locationId) {
    const sql = `
      SELECT image_id, image_url, thumbnail_url, display_order, uploaded_at 
      FROM location_images 
      WHERE location_id = ? 
      ORDER BY display_order ASC, uploaded_at ASC
    `;
    const results = await query(sql, [locationId]);
    return results;
  }

  /**
   * Update image display order
   */
  static async updateImageOrder(imageId, displayOrder) {
    const sql = 'UPDATE location_images SET display_order = ? WHERE image_id = ?';
    await query(sql, [displayOrder, imageId]);
    return { success: true };
  }

  /**
   * Count total locations
   */
  static async count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM locations WHERE 1=1';
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.location_type) {
      sql += ' AND location_type = ?';
      params.push(filters.location_type);
    }

    const results = await query(sql, params);
    return results[0].total;
  }
}

module.exports = Location;
