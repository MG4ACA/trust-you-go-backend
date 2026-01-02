const { query } = require('../config/database');
const { generateUUID, formatDate } = require('../utils/helpers');

class Booking {
  /**
   * Find booking by ID
   */
  static async findById(bookingId) {
    const sql = `
      SELECT 
        b.*,
        p.title as package_title,
        p.no_of_days as package_days,
        t.name as traveler_name,
        t.email as traveler_email,
        t.contact as traveler_contact,
        a.name as agent_name,
        a.email as agent_email,
        adm.name as confirmed_by_name
      FROM bookings b
      INNER JOIN packages p ON b.package_id = p.package_id
      INNER JOIN travelers t ON b.traveler_id = t.traveler_id
      LEFT JOIN agents a ON b.agent_id = a.agent_id
      LEFT JOIN admins adm ON b.confirmed_by = adm.admin_id
      WHERE b.booking_id = ?
    `;
    const results = await query(sql, [bookingId]);
    return results[0];
  }

  /**
   * Get all bookings with filters
   */
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        b.booking_id, b.status, b.no_of_travelers, b.start_date, b.end_date, 
        b.total_amount, b.payment_status, b.booking_date, b.confirmation_date,
        p.title as package_title,
        t.name as traveler_name,
        t.email as traveler_email,
        a.name as agent_name
      FROM bookings b
      INNER JOIN packages p ON b.package_id = p.package_id
      INNER JOIN travelers t ON b.traveler_id = t.traveler_id
      LEFT JOIN agents a ON b.agent_id = a.agent_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      sql += ' AND b.status = ?';
      params.push(filters.status);
    }

    if (filters.traveler_id) {
      sql += ' AND b.traveler_id = ?';
      params.push(filters.traveler_id);
    }

    if (filters.agent_id) {
      sql += ' AND b.agent_id = ?';
      params.push(filters.agent_id);
    }

    if (filters.package_id) {
      sql += ' AND b.package_id = ?';
      params.push(filters.package_id);
    }

    if (filters.payment_status) {
      sql += ' AND b.payment_status = ?';
      params.push(filters.payment_status);
    }

    sql += ' ORDER BY b.booking_date DESC';

    const results = await query(sql, params);
    return results;
  }

  /**
   * Create new booking (during submission)
   */
  static async create(data) {
    const bookingId = generateUUID();

    const sql = `
      INSERT INTO bookings (
        booking_id, package_id, traveler_id, agent_id, status, 
        no_of_travelers, start_date, end_date, total_amount, 
        payment_status, traveler_notes
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      bookingId,
      data.package_id,
      data.traveler_id,
      data.agent_id || null,
      'temporary',
      data.no_of_travelers || 1,
      data.start_date ? formatDate(data.start_date) : null,
      data.end_date ? formatDate(data.end_date) : null,
      data.total_amount || null,
      'pending',
      data.traveler_notes || null,
    ]);

    return this.findById(bookingId);
  }

  /**
   * Update booking
   */
  static async update(bookingId, data) {
    const updates = [];
    const params = [];

    if (data.status !== undefined) {
      updates.push('status = ?');
      params.push(data.status);
    }

    if (data.no_of_travelers !== undefined) {
      updates.push('no_of_travelers = ?');
      params.push(data.no_of_travelers);
    }

    if (data.start_date !== undefined) {
      updates.push('start_date = ?');
      params.push(data.start_date ? formatDate(data.start_date) : null);
    }

    if (data.end_date !== undefined) {
      updates.push('end_date = ?');
      params.push(data.end_date ? formatDate(data.end_date) : null);
    }

    if (data.total_amount !== undefined) {
      updates.push('total_amount = ?');
      params.push(data.total_amount);
    }

    if (data.payment_status !== undefined) {
      updates.push('payment_status = ?');
      params.push(data.payment_status);
    }

    if (data.agent_id !== undefined) {
      updates.push('agent_id = ?');
      params.push(data.agent_id);
    }

    if (data.admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      params.push(data.admin_notes);
    }

    if (data.traveler_notes !== undefined) {
      updates.push('traveler_notes = ?');
      params.push(data.traveler_notes);
    }

    if (updates.length === 0) {
      return this.findById(bookingId);
    }

    params.push(bookingId);
    const sql = `UPDATE bookings SET ${updates.join(', ')} WHERE booking_id = ?`;

    await query(sql, params);
    return this.findById(bookingId);
  }

  /**
   * Confirm booking (admin confirms and activates traveler)
   */
  static async confirm(bookingId, adminId) {
    const sql = `
      UPDATE bookings 
      SET status = 'confirmed', confirmation_date = NOW(), confirmed_by = ? 
      WHERE booking_id = ?
    `;
    await query(sql, [adminId, bookingId]);
    return this.findById(bookingId);
  }

  /**
   * Cancel booking
   */
  static async cancel(bookingId) {
    const sql = 'UPDATE bookings SET status = ? WHERE booking_id = ?';
    await query(sql, ['cancelled', bookingId]);
    return this.findById(bookingId);
  }

  /**
   * Update booking status
   */
  static async updateStatus(bookingId, status) {
    const sql = 'UPDATE bookings SET status = ? WHERE booking_id = ?';
    await query(sql, [status, bookingId]);
    return this.findById(bookingId);
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(bookingId, paymentStatus) {
    const sql = 'UPDATE bookings SET payment_status = ? WHERE booking_id = ?';
    await query(sql, [paymentStatus, bookingId]);
    return this.findById(bookingId);
  }

  /**
   * Get bookings by traveler ID
   */
  static async findByTravelerId(travelerId) {
    return this.findAll({ traveler_id: travelerId });
  }

  /**
   * Get bookings by agent ID
   */
  static async findByAgentId(agentId) {
    return this.findAll({ agent_id: agentId });
  }

  /**
   * Count total bookings
   */
  static async count(filters = {}) {
    let sql = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1';
    const params = [];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.traveler_id) {
      sql += ' AND traveler_id = ?';
      params.push(filters.traveler_id);
    }

    if (filters.payment_status) {
      sql += ' AND payment_status = ?';
      params.push(filters.payment_status);
    }

    const results = await query(sql, params);
    return results[0].total;
  }

  /**
   * Get booking statistics
   */
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'temporary' THEN 1 ELSE 0 END) as temporary_bookings,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
        SUM(total_amount) as total_revenue,
        SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as paid_revenue
      FROM bookings
    `;
    const results = await query(sql);
    return results[0];
  }
}

module.exports = Booking;
