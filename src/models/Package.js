const { query, transaction } = require('../config/database');
const { generateUUID } = require('../utils/helpers');

class Package {
  /**
   * Find package by ID
   */
  static async findById(packageId) {
    const sql = `
      SELECT 
        p.package_id, p.title, p.description, p.no_of_days, p.is_template, 
        p.status, p.is_active, p.base_price, p.created_by, p.created_at, p.updated_at,
        a.name as created_by_name
      FROM packages p
      LEFT JOIN admins a ON p.created_by = a.admin_id
      WHERE p.package_id = ?
    `;
    const results = await query(sql, [packageId]);
    return results[0];
  }

  /**
   * Find package by ID with full itinerary (locations)
   */
  static async findByIdWithItinerary(packageId) {
    const pkg = await this.findById(packageId);

    if (!pkg) {
      return null;
    }

    const itinerarySql = `
      SELECT 
        pl.id,
        pl.day_number,
        pl.visit_order,
        pl.notes,
        l.location_id,
        l.name as location_name,
        l.description as location_description,
        l.location_type,
        l.location_url,
        (SELECT image_url FROM location_images WHERE location_id = l.location_id ORDER BY display_order ASC LIMIT 1) as image_url
      FROM package_locations pl
      INNER JOIN locations l ON pl.location_id = l.location_id
      WHERE pl.package_id = ?
      ORDER BY pl.day_number ASC, pl.visit_order ASC
    `;
    const itinerary = await query(itinerarySql, [packageId]);

    // Group by days
    const days = {};
    itinerary.forEach((item) => {
      if (!days[item.day_number]) {
        days[item.day_number] = [];
      }
      days[item.day_number].push({
        id: item.id,
        visit_order: item.visit_order,
        notes: item.notes,
        location: {
          location_id: item.location_id,
          name: item.location_name,
          description: item.location_description,
          location_type: item.location_type,
          location_url: item.location_url,
          image_url: item.image_url,
        },
      });
    });

    pkg.itinerary = days;
    return pkg;
  }

  /**
   * Get all packages with filters
   */
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        p.package_id, p.title, p.description, p.no_of_days, p.is_template, 
        p.status, p.is_active, p.base_price, p.created_by, p.created_at, p.updated_at,
        a.name as created_by_name
      FROM packages p
      LEFT JOIN admins a ON p.created_by = a.admin_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ' AND p.is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.status) {
      sql += ' AND p.status = ?';
      params.push(filters.status);
    }

    if (filters.is_template !== undefined) {
      sql += ' AND p.is_template = ?';
      params.push(filters.is_template);
    }

    if (filters.search) {
      sql += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY p.created_at DESC';

    const results = await query(sql, params);
    return results;
  }

  /**
   * Create new package
   */
  static async create(data) {
    const packageId = generateUUID();

    const sql = `
      INSERT INTO packages (package_id, title, description, no_of_days, is_template, status, base_price, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      packageId,
      data.title,
      data.description || null,
      data.no_of_days,
      data.is_template || false,
      data.status || 'draft',
      data.base_price || null,
      data.created_by || null,
    ]);

    return this.findById(packageId);
  }

  /**
   * Update package details
   */
  static async update(packageId, data) {
    const updates = [];
    const params = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      params.push(data.title);
    }

    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description);
    }

    if (data.no_of_days !== undefined) {
      updates.push('no_of_days = ?');
      params.push(data.no_of_days);
    }

    if (data.is_template !== undefined) {
      updates.push('is_template = ?');
      params.push(data.is_template);
    }

    if (data.status !== undefined) {
      updates.push('status = ?');
      params.push(data.status);
    }

    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(data.is_active);
    }

    if (data.base_price !== undefined) {
      updates.push('base_price = ?');
      params.push(data.base_price);
    }

    if (updates.length === 0) {
      return this.findById(packageId);
    }

    params.push(packageId);
    const sql = `UPDATE packages SET ${updates.join(', ')} WHERE package_id = ?`;

    await query(sql, params);
    return this.findById(packageId);
  }

  /**
   * Update package itinerary (replaces all locations)
   */
  static async updateItinerary(packageId, itineraryData) {
    return await transaction(async (connection) => {
      // Delete existing itinerary
      await connection.execute('DELETE FROM package_locations WHERE package_id = ?', [packageId]);

      // Insert new itinerary
      for (const item of itineraryData) {
        const id = generateUUID();
        await connection.execute(
          'INSERT INTO package_locations (id, package_id, location_id, day_number, visit_order, notes) VALUES (?, ?, ?, ?, ?, ?)',
          [
            id,
            packageId,
            item.location_id,
            item.day_number,
            item.visit_order || 0,
            item.notes || null,
          ]
        );
      }

      return { success: true };
    });
  }

  /**
   * Publish package (change status to published)
   */
  static async publish(packageId) {
    const sql = 'UPDATE packages SET status = ? WHERE package_id = ?';
    await query(sql, ['published', packageId]);
    return this.findById(packageId);
  }

  /**
   * Unpublish package (change status to draft)
   */
  static async unpublish(packageId) {
    const sql = 'UPDATE packages SET status = ? WHERE package_id = ?';
    await query(sql, ['draft', packageId]);
    return this.findById(packageId);
  }

  /**
   * Soft delete (deactivate) package
   */
  static async deactivate(packageId) {
    const sql = 'UPDATE packages SET is_active = FALSE WHERE package_id = ?';
    await query(sql, [packageId]);
    return { success: true };
  }

  /**
   * Duplicate package (clone)
   */
  static async duplicate(packageId, newTitle) {
    return await transaction(async (connection) => {
      // Get original package
      const [original] = await connection.execute('SELECT * FROM packages WHERE package_id = ?', [
        packageId,
      ]);

      if (original.length === 0) {
        throw new Error('Package not found');
      }

      const originalPkg = original[0];
      const newPackageId = generateUUID();

      // Create duplicate package
      await connection.execute(
        'INSERT INTO packages (package_id, title, description, no_of_days, is_template, status, base_price, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newPackageId,
          newTitle || `${originalPkg.title} (Copy)`,
          originalPkg.description,
          originalPkg.no_of_days,
          originalPkg.is_template,
          'draft',
          originalPkg.base_price,
          originalPkg.created_by,
        ]
      );

      // Copy itinerary
      const [itinerary] = await connection.execute(
        'SELECT * FROM package_locations WHERE package_id = ?',
        [packageId]
      );

      for (const item of itinerary) {
        const newId = generateUUID();
        await connection.execute(
          'INSERT INTO package_locations (id, package_id, location_id, day_number, visit_order, notes) VALUES (?, ?, ?, ?, ?, ?)',
          [newId, newPackageId, item.location_id, item.day_number, item.visit_order, item.notes]
        );
      }

      return newPackageId;
    });
  }

  /**
   * Count total packages
   */
  static async count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM packages WHERE 1=1';
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.is_template !== undefined) {
      sql += ' AND is_template = ?';
      params.push(filters.is_template);
    }

    const results = await query(sql, params);
    return results[0].total;
  }
}

module.exports = Package;
