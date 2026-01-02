const { query } = require('../config/database');
const bcrypt = require('bcryptjs');
const { generateUUID } = require('../utils/helpers');

class Admin {
  /**
   * Find admin by ID
   */
  static async findById(adminId) {
    const sql = `
      SELECT admin_id, email, name, contact, is_active, created_at, last_login 
      FROM admins 
      WHERE admin_id = ?
    `;
    const results = await query(sql, [adminId]);
    return results[0];
  }

  /**
   * Find admin by email (includes password_hash for authentication)
   */
  static async findByEmail(email) {
    const sql = 'SELECT * FROM admins WHERE email = ?';
    const results = await query(sql, [email]);
    return results[0];
  }

  /**
   * Find admin by email (without password)
   */
  static async findByEmailPublic(email) {
    const sql = `
      SELECT admin_id, email, name, contact, is_active, created_at, last_login 
      FROM admins 
      WHERE email = ?
    `;
    const results = await query(sql, [email]);
    return results[0];
  }

  /**
   * Get all admins with filters
   */
  static async findAll(filters = {}) {
    let sql = `
      SELECT admin_id, email, name, contact, is_active, created_at, last_login 
      FROM admins 
      WHERE 1=1
    `;
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY created_at DESC';

    const results = await query(sql, params);
    return results;
  }

  /**
   * Create new admin
   */
  static async create(data) {
    const adminId = generateUUID();
    const passwordHash = await bcrypt.hash(data.password, 10);

    const sql = `
      INSERT INTO admins (admin_id, email, password_hash, name, contact) 
      VALUES (?, ?, ?, ?, ?)
    `;

    await query(sql, [adminId, data.email, passwordHash, data.name, data.contact]);
    return this.findById(adminId);
  }

  /**
   * Update admin details
   */
  static async update(adminId, data) {
    const updates = [];
    const params = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name);
    }

    if (data.contact !== undefined) {
      updates.push('contact = ?');
      params.push(data.contact);
    }

    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(data.is_active);
    }

    if (updates.length === 0) {
      return this.findById(adminId);
    }

    params.push(adminId);
    const sql = `UPDATE admins SET ${updates.join(', ')} WHERE admin_id = ?`;

    await query(sql, params);
    return this.findById(adminId);
  }

  /**
   * Update admin password
   */
  static async updatePassword(adminId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE admins SET password_hash = ? WHERE admin_id = ?';
    await query(sql, [passwordHash, adminId]);
    return { success: true };
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(adminId) {
    const sql = 'UPDATE admins SET last_login = NOW() WHERE admin_id = ?';
    await query(sql, [adminId]);
  }

  /**
   * Soft delete (deactivate) admin
   */
  static async deactivate(adminId) {
    const sql = 'UPDATE admins SET is_active = FALSE WHERE admin_id = ?';
    await query(sql, [adminId]);
    return { success: true };
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Count total admins
   */
  static async count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM admins WHERE 1=1';
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    const results = await query(sql, params);
    return results[0].total;
  }
}

module.exports = Admin;
