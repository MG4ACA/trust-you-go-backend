const { query } = require('../config/database');
const { generateUUID, formatDate } = require('../utils/helpers');

class PackageRequest {
  /**
   * Find package request by ID
   */
  static async findById(requestId) {
    const sql = `
      SELECT 
        pr.*,
        t.name as traveler_name,
        t.email as traveler_email,
        t.contact as traveler_contact,
        a.name as reviewed_by_name,
        p.title as created_package_title
      FROM package_requests pr
      INNER JOIN travelers t ON pr.traveler_id = t.traveler_id
      LEFT JOIN admins a ON pr.reviewed_by = a.admin_id
      LEFT JOIN packages p ON pr.created_package_id = p.package_id
      WHERE pr.request_id = ?
    `;
    const results = await query(sql, [requestId]);
    return results[0];
  }

  /**
   * Get all package requests with filters
   */
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        pr.request_id, pr.title, pr.description, pr.no_of_days, pr.no_of_travelers,
        pr.preferred_start_date, pr.budget_range, pr.status, pr.created_at,
        t.name as traveler_name,
        t.email as traveler_email,
        a.name as reviewed_by_name
      FROM package_requests pr
      INNER JOIN travelers t ON pr.traveler_id = t.traveler_id
      LEFT JOIN admins a ON pr.reviewed_by = a.admin_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      sql += ' AND pr.status = ?';
      params.push(filters.status);
    }

    if (filters.traveler_id) {
      sql += ' AND pr.traveler_id = ?';
      params.push(filters.traveler_id);
    }

    if (filters.search) {
      sql += ' AND (pr.title LIKE ? OR pr.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY pr.created_at DESC';

    const results = await query(sql, params);
    return results;
  }

  /**
   * Create new package request (from traveler)
   */
  static async create(data) {
    const requestId = generateUUID();

    const sql = `
      INSERT INTO package_requests (
        request_id, traveler_id, title, description, no_of_days, 
        no_of_travelers, preferred_start_date, budget_range, special_requirements
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      requestId,
      data.traveler_id,
      data.title,
      data.description,
      data.no_of_days,
      data.no_of_travelers || 1,
      data.preferred_start_date ? formatDate(data.preferred_start_date) : null,
      data.budget_range || null,
      data.special_requirements || null,
    ]);

    return this.findById(requestId);
  }

  /**
   * Update package request
   */
  static async update(requestId, data) {
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

    if (data.no_of_travelers !== undefined) {
      updates.push('no_of_travelers = ?');
      params.push(data.no_of_travelers);
    }

    if (data.preferred_start_date !== undefined) {
      updates.push('preferred_start_date = ?');
      params.push(data.preferred_start_date ? formatDate(data.preferred_start_date) : null);
    }

    if (data.budget_range !== undefined) {
      updates.push('budget_range = ?');
      params.push(data.budget_range);
    }

    if (data.special_requirements !== undefined) {
      updates.push('special_requirements = ?');
      params.push(data.special_requirements);
    }

    if (data.status !== undefined) {
      updates.push('status = ?');
      params.push(data.status);
    }

    if (data.admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      params.push(data.admin_notes);
    }

    if (data.reviewed_by !== undefined) {
      updates.push('reviewed_by = ?');
      params.push(data.reviewed_by);
    }

    if (data.created_package_id !== undefined) {
      updates.push('created_package_id = ?');
      params.push(data.created_package_id);
    }

    if (updates.length === 0) {
      return this.findById(requestId);
    }

    params.push(requestId);
    const sql = `UPDATE package_requests SET ${updates.join(', ')} WHERE request_id = ?`;

    await query(sql, params);
    return this.findById(requestId);
  }

  /**
   * Update request status
   */
  static async updateStatus(requestId, status, adminId, adminNotes = null) {
    const sql = `
      UPDATE package_requests 
      SET status = ?, reviewed_by = ?, admin_notes = ? 
      WHERE request_id = ?
    `;
    await query(sql, [status, adminId, adminNotes, requestId]);
    return this.findById(requestId);
  }

  /**
   * Approve request and link to created package
   */
  static async approve(requestId, adminId, packageId, adminNotes = null) {
    const sql = `
      UPDATE package_requests 
      SET status = 'approved', reviewed_by = ?, created_package_id = ?, admin_notes = ? 
      WHERE request_id = ?
    `;
    await query(sql, [adminId, packageId, adminNotes, requestId]);
    return this.findById(requestId);
  }

  /**
   * Reject request
   */
  static async reject(requestId, adminId, adminNotes) {
    const sql = `
      UPDATE package_requests 
      SET status = 'rejected', reviewed_by = ?, admin_notes = ? 
      WHERE request_id = ?
    `;
    await query(sql, [adminId, adminNotes, requestId]);
    return this.findById(requestId);
  }

  /**
   * Get requests by traveler ID
   */
  static async findByTravelerId(travelerId) {
    return this.findAll({ traveler_id: travelerId });
  }

  /**
   * Count total package requests
   */
  static async count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM package_requests WHERE 1=1';
    const params = [];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.traveler_id) {
      sql += ' AND traveler_id = ?';
      params.push(filters.traveler_id);
    }

    const results = await query(sql, params);
    return results[0].total;
  }

  /**
   * Get package request statistics
   */
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_requests,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_requests,
        SUM(CASE WHEN status = 'reviewing' THEN 1 ELSE 0 END) as reviewing_requests,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_requests,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_requests
      FROM package_requests
    `;
    const results = await query(sql);
    return results[0];
  }
}

module.exports = PackageRequest;
