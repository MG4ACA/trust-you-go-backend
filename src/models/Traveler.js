const { query } = require('../config/database');
const bcrypt = require('bcryptjs');
const { generateUUID } = require('../utils/helpers');

class Traveler {
  /**
   * Find traveler by ID
   */
  static async findById(travelerId) {
    const sql = `
      SELECT traveler_id, email, name, contact, is_active, created_at, last_login 
      FROM travelers 
      WHERE traveler_id = ?
    `;
    const results = await query(sql, [travelerId]);
    return results[0];
  }

  /**
   * Find traveler by email (includes password_hash for authentication)
   */
  static async findByEmail(email) {
    const sql = 'SELECT * FROM travelers WHERE email = ?';
    const results = await query(sql, [email]);
    return results[0];
  }

  /**
   * Find traveler by email (without password)
   */
  static async findByEmailPublic(email) {
    const sql = `
      SELECT traveler_id, email, name, contact, is_active, created_at, last_login 
      FROM travelers 
      WHERE email = ?
    `;
    const results = await query(sql, [email]);
    return results[0];
  }

  /**
   * Get all travelers with filters
   */
  static async findAll(filters = {}) {
    let sql = `
      SELECT traveler_id, email, name, contact, is_active, created_at, last_login 
      FROM travelers 
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
   * Create new traveler (during booking submission)
   */
  static async create(data) {
    const travelerId = generateUUID();
    const passwordHash = await bcrypt.hash(data.password, 10);

    const sql = `
      INSERT INTO travelers (traveler_id, email, password_hash, name, contact, is_active) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      travelerId,
      data.email,
      passwordHash,
      data.name,
      data.contact,
      data.is_active || false,
    ]);

    return this.findById(travelerId);
  }

  /**
   * Update traveler details
   */
  static async update(travelerId, data) {
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

    if (data.email !== undefined) {
      updates.push('email = ?');
      params.push(data.email);
    }

    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(data.is_active);
    }

    if (updates.length === 0) {
      return this.findById(travelerId);
    }

    params.push(travelerId);
    const sql = `UPDATE travelers SET ${updates.join(', ')} WHERE traveler_id = ?`;

    await query(sql, params);
    return this.findById(travelerId);
  }

  /**
   * Activate traveler account (when booking is confirmed)
   */
  static async activate(travelerId) {
    const sql = 'UPDATE travelers SET is_active = TRUE WHERE traveler_id = ?';
    await query(sql, [travelerId]);
    return this.findById(travelerId);
  }

  /**
   * Update traveler password
   */
  static async updatePassword(travelerId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE travelers SET password_hash = ? WHERE traveler_id = ?';
    await query(sql, [passwordHash, travelerId]);
    return { success: true };
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(travelerId) {
    const sql = 'UPDATE travelers SET last_login = NOW() WHERE traveler_id = ?';
    await query(sql, [travelerId]);
  }

  /**
   * Delete traveler
   */
  static async delete(travelerId) {
    const sql = 'DELETE FROM travelers WHERE traveler_id = ?';
    await query(sql, [travelerId]);
    return { success: true };
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Count total travelers
   */
  static async count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM travelers WHERE 1=1';
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    const results = await query(sql, params);
    return results[0].total;
  }
}

module.exports = Traveler;
