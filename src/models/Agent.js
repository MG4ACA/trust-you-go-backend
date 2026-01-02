const { query } = require('../config/database');
const { generateUUID } = require('../utils/helpers');

class Agent {
  /**
   * Find agent by ID
   */
  static async findById(agentId) {
    const sql = `
      SELECT agent_id, name, contact, email, commission_rate, is_active, notes, created_at, updated_at 
      FROM agents 
      WHERE agent_id = ?
    `;
    const results = await query(sql, [agentId]);
    return results[0];
  }

  /**
   * Find agent by email
   */
  static async findByEmail(email) {
    const sql = `
      SELECT agent_id, name, contact, email, commission_rate, is_active, notes, created_at, updated_at 
      FROM agents 
      WHERE email = ?
    `;
    const results = await query(sql, [email]);
    return results[0];
  }

  /**
   * Get all agents with filters
   */
  static async findAll(filters = {}) {
    let sql = `
      SELECT agent_id, name, contact, email, commission_rate, is_active, notes, created_at, updated_at 
      FROM agents 
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

    sql += ' ORDER BY name ASC';

    const results = await query(sql, params);
    return results;
  }

  /**
   * Create new agent
   */
  static async create(data) {
    const agentId = generateUUID();

    const sql = `
      INSERT INTO agents (agent_id, name, contact, email, commission_rate, notes) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      agentId,
      data.name,
      data.contact,
      data.email,
      data.commission_rate || 0.0,
      data.notes || null,
    ]);

    return this.findById(agentId);
  }

  /**
   * Update agent details
   */
  static async update(agentId, data) {
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

    if (data.commission_rate !== undefined) {
      updates.push('commission_rate = ?');
      params.push(data.commission_rate);
    }

    if (data.notes !== undefined) {
      updates.push('notes = ?');
      params.push(data.notes);
    }

    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(data.is_active);
    }

    if (updates.length === 0) {
      return this.findById(agentId);
    }

    params.push(agentId);
    const sql = `UPDATE agents SET ${updates.join(', ')} WHERE agent_id = ?`;

    await query(sql, params);
    return this.findById(agentId);
  }

  /**
   * Soft delete (deactivate) agent
   */
  static async deactivate(agentId) {
    const sql = 'UPDATE agents SET is_active = FALSE WHERE agent_id = ?';
    await query(sql, [agentId]);
    return { success: true };
  }

  /**
   * Activate agent
   */
  static async activate(agentId) {
    const sql = 'UPDATE agents SET is_active = TRUE WHERE agent_id = ?';
    await query(sql, [agentId]);
    return this.findById(agentId);
  }

  /**
   * Get agent with booking statistics
   */
  static async findByIdWithStats(agentId) {
    const sql = `
      SELECT 
        a.*,
        COUNT(b.booking_id) as total_bookings,
        SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
        SUM(b.total_amount) as total_revenue
      FROM agents a
      LEFT JOIN bookings b ON a.agent_id = b.agent_id
      WHERE a.agent_id = ?
      GROUP BY a.agent_id
    `;
    const results = await query(sql, [agentId]);
    return results[0];
  }

  /**
   * Count total agents
   */
  static async count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM agents WHERE 1=1';
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    const results = await query(sql, params);
    return results[0].total;
  }
}

module.exports = Agent;
