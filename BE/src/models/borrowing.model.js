const { pool } = require('../config/database');
const Notification = require('./notification.model');

const Borrowing = {
  /**
   * Confirm delivery - Create borrowing record when librarian confirms reader picked up book
   * @param {number} request_id - ID of approved borrow request
   * @returns {Object} Created borrowing record with full details
   * @throws {Error} If validation fails or database error
   */
  async create(request_id) {
    if (!request_id) {
      throw new Error('request_id is required');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Get request details with all necessary info
      const requestQuery = `
        SELECT 
          br.request_id, 
          br.reader_id, 
          br.copy_id, 
          br.pickup_date, 
          br.status,
          bc.condition,
          bc.copy_price,
          bc.availability,
          bt.title,
          u.user_id,
          u.name as reader_name,
          u.status as user_status
        FROM borrow_requests br
        JOIN book_copies bc ON br.copy_id = bc.copy_id
        JOIN book_titles bt ON bc.book_id = bt.book_id
        JOIN readers r ON br.reader_id = r.reader_id
        JOIN users u ON r.user_id = u.user_id
        WHERE br.request_id = $1
      `;
      const requestResult = await client.query(requestQuery, [request_id]);
      
      if (requestResult.rows.length === 0) {
        throw new Error('Borrow request not found');
      }

      const request = requestResult.rows[0];

      // 2. Validate request status
      if (request.status !== 'approved') {
        throw new Error(`Cannot confirm delivery for request with status: ${request.status}`);
      }

      // 3. Validate copy is still available
      if (!request.availability) {
        throw new Error('Copy is no longer available');
      }

      // 4. Check if borrowing record already exists for this request
      const existingCheck = await client.query(
        'SELECT borrow_id FROM borrowing_records WHERE request_id = $1',
        [request_id]
      );
      if (existingCheck.rows.length > 0) {
        throw new Error('Borrowing record already exists for this request');
      }

      // 5. Check borrow limit (max 5 active borrows per reader)
      const activeBorrowsCheck = await client.query(
        'SELECT COUNT(*) as count FROM borrowing_records WHERE reader_id = $1 AND status = $2',
        [request.reader_id, 'approved']
      );
      const activeBorrowCount = parseInt(activeBorrowsCheck.rows[0].count);
      if (activeBorrowCount >= 5) {
        throw new Error('Reader has reached maximum borrow limit (5 active books)');
      }

      // 6. Calculate due_date (NOW + 30 days)
      const borrowDate = new Date();
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + 30);

      // 7. Create borrowing record (borrowed_copy_price set by trigger)
      const insertQuery = `
        INSERT INTO borrowing_records 
        (reader_id, copy_id, request_id, borrow_date, due_date, status, renew_count)
        VALUES ($1, $2, $3, $4, $5, 'approved', 0)
        RETURNING *
      `;
      const borrowingResult = await client.query(insertQuery, [
        request.reader_id,
        request.copy_id,
        request_id,
        borrowDate,
        dueDate
      ]);

      // 8. Update copy borrowed status to TRUE
      await client.query(
        'UPDATE book_copies SET borrowed = TRUE WHERE copy_id = $1',
        [request.copy_id]
      );

      // 9. Update user's borrow_count and status
      await client.query(`
        UPDATE users 
        SET borrow_count = borrow_count + 1,
            status = CASE 
              WHEN borrow_count + 1 >= 5 THEN 'borrowing'
              ELSE status
            END
        WHERE user_id = $1
      `, [request.user_id]);

      await client.query('COMMIT');
      
      // 10. Fetch complete borrowing info to return
      const completeBorrowing = await this.findById(borrowingResult.rows[0].borrow_id);
      return completeBorrowing;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Find borrowing by ID with full details
   * @param {number} borrow_id - ID of borrowing record
   * @returns {Object|null} Borrowing record with book and copy details
   */
  async findById(borrow_id) {
    if (!borrow_id) {
      throw new Error('borrow_id is required');
    }

    const query = `
      SELECT 
        br.borrow_id,
        br.reader_id,
        br.copy_id,
        br.request_id,
        br.borrow_date,
        br.due_date,
        br.borrowed_copy_price,
        br.status,
        br.renew_count,
        bc.condition as current_condition,
        bc.availability,
        bt.book_id,
        bt.title,
        bt.author,
        bt.publisher,
        bt.publish_year,
        bt.cover,
        bt.isbn,
        u.user_id,
        u.name as reader_name,
        u.email as reader_email,
        u.status as reader_status,
        CASE 
          WHEN br.due_date < CURRENT_TIMESTAMP THEN TRUE 
          ELSE FALSE 
        END as is_overdue,
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - br.due_date)) as days_overdue
      FROM borrowing_records br
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      JOIN readers r ON br.reader_id = r.reader_id
      JOIN users u ON r.user_id = u.user_id
      WHERE br.borrow_id = $1
    `;
    const result = await pool.query(query, [borrow_id]);
    return result.rows[0] || null;
  },

  /**
   * Find all borrowings for a specific reader
   * @param {number} reader_id - ID of reader
   * @param {string} status_filter - Optional: filter by status
   * @returns {Array} Array of borrowing records
   */
  async findByReaderId(reader_id, status_filter = null) {
    if (!reader_id) {
      throw new Error('reader_id is required');
    }

    let query = `
      SELECT 
        br.borrow_id,
        br.copy_id,
        br.request_id,
        br.borrow_date,
        br.due_date,
        br.borrowed_copy_price,
        br.status,
        br.renew_count,
        br.borrowed_condition, -- Condition when borrowed
        bc.condition as current_copy_condition, -- Current condition of the copy
        bt.book_id,
        bt.title,
        bt.author,
        bt.publisher,
        bt.cover,
        bt.isbn,
        CASE 
          WHEN br.due_date < CURRENT_TIMESTAMP AND br.status = 'approved' THEN TRUE 
          ELSE FALSE 
        END as is_overdue,
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - br.due_date)) as days_overdue,
        rr.completed_at as returned_date, -- Actual return date
        rr.overdue_fee as late_fee,
        rr.damage_fee as damage_fee,
        rr.returned_condition as returned_condition_by_reader, -- Reader's assessed condition
        rr.assessed_condition as final_assessed_condition, -- Librarian's assessed condition
        rr.total_fee as total_charge
      FROM borrowing_records br
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      LEFT JOIN return_requests rr ON br.borrow_id = rr.borrow_id AND rr.status = 'completed'
      WHERE br.reader_id = $1
    `;

    const params = [reader_id];
    
    if (status_filter) {
      query += ' AND br.status = $2';
      params.push(status_filter);
    }

    query += ' ORDER BY br.borrow_date DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  /**
   * Find active borrowings (status = 'approved')
   * @param {number} reader_id - Optional: filter by reader
   * @returns {Array} Array of active borrowings with overdue info
   */
  async findActive(reader_id = null) {
    let query = `
      SELECT 
        br.borrow_id,
        br.reader_id,
        br.copy_id,
        br.request_id,
        br.borrow_date,
        br.due_date,
        br.borrowed_copy_price,
        br.status,
        br.renew_count,
        bc.condition as current_condition,
        bt.book_id,
        bt.title,
        bt.author,
        bt.publisher,
        bt.cover,
        bt.isbn,
        u.user_id,
        u.name as reader_name,
        u.email as reader_email,
        u.status as reader_status,
        CASE 
          WHEN br.due_date < CURRENT_TIMESTAMP THEN TRUE 
          ELSE FALSE 
        END as is_overdue,
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - br.due_date)) as days_overdue
      FROM borrowing_records br
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      JOIN readers r ON br.reader_id = r.reader_id
      JOIN users u ON r.user_id = u.user_id
      WHERE br.status = 'approved'
    `;
    
    const params = [];
    if (reader_id) {
      query += ' AND br.reader_id = $1';
      params.push(reader_id);
    }
    
    query += ' ORDER BY br.due_date ASC';
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  /**
   * Renew/extend borrowing with custom due date (max 14 days from today)
   * @param {number} borrow_id - ID of borrowing to renew
   * @param {number} reader_id - ID of reader requesting renewal
   * @param {Date|string} new_due_date - New due date chosen by reader
   * @returns {Object} Updated borrowing record
   * @throws {Error} If validation fails
   */
  async renew(borrow_id, reader_id) {
    if (!borrow_id || !reader_id) {
      throw new Error('borrow_id and reader_id are required');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Get full borrowing info
      const borrowingCheck = await client.query(
        'SELECT * FROM borrowing_records WHERE borrow_id = $1 AND reader_id = $2',
        [borrow_id, reader_id]
      );

      if (borrowingCheck.rows.length === 0) {
        throw new Error('Borrowing record not found or does not belong to this reader');
      }

      const record = borrowingCheck.rows[0];

      // 2. Validate status
      if (record.status !== 'approved') {
        throw new Error(`Cannot renew borrowing with status: ${record.status}`);
      }

      // 3. Check renewal limit
      if (record.renew_count >= 1) {
        throw new Error('Maximum renewal limit reached (1 renewal allowed per borrowing)');
      }

      // 4. Check if currently overdue
      const currentDate = new Date();
      const currentDueDate = new Date(record.due_date);
      if (currentDueDate < currentDate) {
        throw new Error('Cannot renew overdue borrowing');
      }

      // 5. Calculate new due date by adding 14 days to the current due date
      const newDueDate = new Date(currentDueDate);
      newDueDate.setDate(newDueDate.getDate() + 14);

      // 6. Update borrowing record
      const updateQuery = `
        UPDATE borrowing_records 
        SET due_date = $1, 
            renew_count = renew_count + 1
        WHERE borrow_id = $2
        RETURNING *
      `;
      const result = await client.query(updateQuery, [newDueDate, borrow_id]);

      await client.query('COMMIT');
      
      // 7. Return full borrowing info
      const updatedBorrowing = await this.findById(borrow_id);
      return updatedBorrowing;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Update borrowing status
   * @param {number} borrow_id - ID of borrowing
   * @param {string} status - New status
   * @returns {Object} Updated borrowing record
   */
  async updateStatus(borrow_id, status) {
    if (!borrow_id || !status) {
      throw new Error('borrow_id and status are required');
    }

    const validStatuses = ['pending', 'approved', 'returned', 'overdue', 'lost'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const query = `
      UPDATE borrowing_records 
      SET status = $1
      WHERE borrow_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, borrow_id]);
    
    if (result.rows.length === 0) {
      throw new Error('Borrowing record not found');
    }

    return result.rows[0];
  },

  /**
   * Check if reader has pending return request for borrowing
   * @param {number} borrow_id - ID of borrowing
   * @returns {boolean} true if has pending return request
   */
  async hasPendingReturnRequest(borrow_id) {
    if (!borrow_id) {
      throw new Error('borrow_id is required');
    }

    const query = `
      SELECT COUNT(*) as count
      FROM return_requests
      WHERE borrow_id = $1
        AND status = 'pending'
    `;
    
    const result = await pool.query(query, [borrow_id]);
    return parseInt(result.rows[0].count) > 0;
  },

  /**
   * Get all overdue borrowings
   * @returns {Array} Array of overdue borrowings
   */
  async findOverdue() {
    const query = `
      SELECT 
        br.borrow_id,
        br.reader_id,
        br.copy_id,
        br.borrow_date,
        br.due_date,
        br.status,
        br.renew_count,
        bt.title,
        u.name as reader_name,
        u.email as reader_email,
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - br.due_date)) as days_overdue
      FROM borrowing_records br
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      JOIN readers r ON br.reader_id = r.reader_id
      JOIN users u ON r.user_id = u.user_id
      WHERE br.status = 'approved'
        AND br.due_date < CURRENT_TIMESTAMP
      ORDER BY br.due_date ASC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Create return request from reader
   * @param {number} borrow_id - ID of borrowing to return
   * @param {number} reader_id - ID of reader making return request
   * @param {number} returned_condition - Reader's self-assessment of book condition (0-100)
   * @param {Object} damage_details - Optional damage details (notes, images)
   * @returns {Object} Created return request
   * @throws {Error} If validation fails
   */
  async createReturnRequest(borrow_id, reader_id, returned_condition, damage_details = null) {
    if (!borrow_id || !reader_id) {
      throw new Error('borrow_id and reader_id are required');
    }

    if (returned_condition === undefined || returned_condition < 0 || returned_condition > 100) {
      throw new Error('returned_condition must be between 0 and 100');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Verify borrowing exists and belongs to reader
      const borrowingCheck = await client.query(
        'SELECT * FROM borrowing_records WHERE borrow_id = $1 AND reader_id = $2',
        [borrow_id, reader_id]
      );

      if (borrowingCheck.rows.length === 0) {
        throw new Error('Borrowing record not found or does not belong to this reader');
      }

      const record = borrowingCheck.rows[0];

      // 2. Check status (only approved borrowings can be returned)
      if (record.status !== 'approved') {
        throw new Error(`Cannot create return request for borrowing with status: ${record.status}`);
      }

      // 3. Check for existing pending return request
      const existingRequest = await client.query(
        'SELECT * FROM return_requests WHERE borrow_id = $1 AND status IN ($2, $3)',
        [borrow_id, 'pending', 'assessed']
      );

      if (existingRequest.rows.length > 0) {
        throw new Error('A pending return request already exists for this borrowing');
      }

      // 4. Create return request with reader's condition assessment
      const insertQuery = `
        INSERT INTO return_requests (
          borrow_id, 
          reader_id,
          returned_condition,
          damage_details,
          status, 
          request_date
        )
        VALUES ($1, $2, $3, $4, 'pending', CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const result = await client.query(insertQuery, [
        borrow_id,
        reader_id, 
        returned_condition,
        damage_details ? JSON.stringify(damage_details) : null
      ]);

      // 5. Get full borrowing info for notification
      const borrowingInfo = await client.query(`
        SELECT 
          br.copy_id,
          bt.title,
          u.user_id,
          u.name as reader_name
        FROM borrowing_records br
        JOIN book_copies bc ON br.copy_id = bc.copy_id
        JOIN book_titles bt ON bc.book_id = bt.book_id
        JOIN readers r ON br.reader_id = r.reader_id
        JOIN users u ON r.user_id = u.user_id
        WHERE br.borrow_id = $1
      `, [borrow_id]);

      const borrowInfo = borrowingInfo.rows[0];

      await client.query('COMMIT');

      // 6. Notify all librarians about new return request
      try {
        await Notification.notifyLibrariansNewReturnRequest(
          result.rows[0].return_id,
          borrow_id,
          borrowInfo.reader_name,
          borrowInfo.title,
          borrowInfo.copy_id
        );
      } catch (notifError) {
        console.error('Failed to notify librarians about new return request:', notifError);
        // Don't throw - notification failure shouldn't block return request creation
      }

      // 7. Return full return request info
      const fullRequest = await this.getReturnRequestById(result.rows[0].return_id);
      return fullRequest;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Get return request by ID with full details
   * @param {number} return_id - ID of return request
   * @returns {Object|null} Return request with borrowing details
   */
  async getReturnRequestById(return_id) {
    if (!return_id) {
      throw new Error('return_id is required');
    }

    const query = `
      SELECT 
        rr.return_id,
        rr.borrow_id,
        rr.status,
        rr.assessed_condition,
        rr.returned_condition,
        rr.overdue_fee,
        rr.damage_fee,
        rr.total_fee,
        rr.damage_details,
        rr.request_date,
        rr.assessed_at,
        rr.completed_at,
        br.reader_id,
        br.copy_id,
        br.borrow_date,
        br.due_date,
        br.borrowed_copy_price,
        br.borrowed_condition,
        br.renew_count,
        bc.condition as current_condition,
        bt.book_id,
        bt.title,
        bt.author,
        bt.cover,
        u.user_id,
        u.name as reader_name,
        u.email as reader_email
      FROM return_requests rr
      JOIN borrowing_records br ON rr.borrow_id = br.borrow_id
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      JOIN readers r ON br.reader_id = r.reader_id
      JOIN users u ON r.user_id = u.user_id
      WHERE rr.return_id = $1
    `;

    const result = await pool.query(query, [return_id]);
    return result.rows[0] || null;
  },

  /**
   * Get all return requests (for librarian)
   * @param {string} status_filter - Optional: filter by status ('pending', 'assessed', 'completed')
   * @returns {Array} Array of return requests
   */
  async getAllReturnRequests(status_filter = null) {
    let query = `
      SELECT 
        rr.return_id,
        rr.borrow_id,
        rr.status,
        rr.assessed_condition,
        rr.returned_condition,
        rr.overdue_fee,
        rr.damage_fee,
        rr.total_fee,
        rr.request_date,
        rr.assessed_at,
        br.reader_id,
        br.copy_id,
        br.borrow_date,
        br.due_date,
        br.borrowed_copy_price,
        bc.condition as current_condition,
        bt.book_id,
        bt.title,
        bt.author,
        bt.cover,
        bt.price as book_price,
        u.user_id,
        u.name as reader_name,
        u.email as reader_email,
        CASE 
          WHEN br.due_date < CURRENT_TIMESTAMP THEN TRUE 
          ELSE FALSE 
        END as is_overdue,
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - br.due_date)) as days_overdue
      FROM return_requests rr
      JOIN borrowing_records br ON rr.borrow_id = br.borrow_id
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      JOIN readers r ON br.reader_id = r.reader_id
      JOIN users u ON r.user_id = u.user_id
    `;

    const params = [];
    if (status_filter) {
      query += ' WHERE rr.status = $1';
      params.push(status_filter);
    }

    query += ' ORDER BY rr.request_date DESC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  /**
   * Assess returned book condition and calculate fees (librarian only)
   * @param {number} return_id - ID of return request
   * @param {Object} assessmentData - Assessment details
   * @param {string} assessmentData.assessed_condition - Overall condition (OK/MINOR/MODERATE/SEVERE/LOST)
   * @param {number} assessmentData.damage_percentage - Librarian-specified damage % (within range for condition)
   * @param {string} assessmentData.assessment_notes - Optional notes from librarian
   * @returns {Object} Updated return request with calculated fees
   * @throws {Error} If validation fails
   */
  async assessReturnCondition(return_id, assessmentData) {
    const { assessed_condition, damage_percentage, assessment_notes } = assessmentData;

    if (!return_id) {
      throw new Error('return_id is required');
    }

    if (!assessed_condition) {
      throw new Error('assessed_condition is required');
    }

    if (damage_percentage === undefined || damage_percentage < 0 || damage_percentage > 100) {
      throw new Error('damage_percentage must be between 0 and 100');
    }

    const validConditions = ['OK', 'MINOR', 'MODERATE', 'SEVERE', 'LOST'];
    if (!validConditions.includes(assessed_condition)) {
      throw new Error(`assessed_condition must be one of: ${validConditions.join(', ')}`);
    }

    // Validate damage_percentage is within range for assessed_condition
    const damageRanges = {
      'OK': [0, 0],
      'MINOR': [5, 10],
      'MODERATE': [20, 40],
      'SEVERE': [60, 80],
      'LOST': [100, 100]
    };

    const range = damageRanges[assessed_condition];
    if (damage_percentage < range[0] || damage_percentage > range[1]) {
      throw new Error(`damage_percentage must be between ${range[0]}% and ${range[1]}% for ${assessed_condition}`);
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Get return request with full borrowing info
      const requestCheck = await client.query(`
        SELECT 
          rr.*,
          br.borrow_date,
          br.due_date,
          br.borrowed_copy_price,
          br.borrowed_condition,
          bc.condition as current_condition,
          bc.copy_id,
          bt.book_id,
          bt.title,
          r.reader_id,
          u.user_id
        FROM return_requests rr
        JOIN borrowing_records br ON rr.borrow_id = br.borrow_id
        JOIN book_copies bc ON br.copy_id = bc.copy_id
        JOIN book_titles bt ON bc.book_id = bt.book_id
        JOIN readers r ON br.reader_id = r.reader_id
        JOIN users u ON r.user_id = u.user_id
        WHERE rr.return_id = $1
      `, [return_id]);

      if (requestCheck.rows.length === 0) {
        throw new Error('Return request not found');
      }

      const request = requestCheck.rows[0];

      // 2. Check status (only pending requests can be assessed)
      if (request.status !== 'pending') {
        throw new Error(`Cannot assess return request with status: ${request.status}`);
      }

      // 3. Calculate overdue fee
      const now = new Date();
      const dueDate = new Date(request.due_date);
      const overdueDays = Math.max(0, Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24)));
      const overdueFee = overdueDays * parseFloat(process.env.OVERDUE_RATE_PER_DAY || 2) * request.borrowed_copy_price / 100;

      // 4. Calculate damage fee using librarian-specified percentage
      const damageFee = request.borrowed_copy_price * damage_percentage / 100;

      // 5. Calculate total fee
      const total_fee = overdueFee + damageFee;

      // 6. Update return request
      const updateQuery = `
        UPDATE return_requests
        SET 
          status = 'assessed',
          assessed_condition = $1,
          damage_percentage = $2,
          overdue_fee = $3,
          damage_fee = $4,
          total_fee = $5,
          assessment_notes = $6,
          assessed_at = CURRENT_TIMESTAMP
        WHERE return_id = $7
        RETURNING *
      `;

      await client.query(updateQuery, [
        assessed_condition,
        damage_percentage,
        overdueFee,
        damageFee,
        total_fee,
        assessment_notes || null,
        return_id
      ]);

      await client.query('COMMIT');

      // 7. Send bill notification to reader
      try {
        await Notification.createAssessmentNotification(
          request.user_id,
          return_id,
          request.title,
          request.copy_id,
          assessed_condition,
          total_fee,
          overdueFee,
          damageFee
        );
      } catch (notifError) {
        console.error('Failed to send assessment notification to reader:', notifError);
        // Don't throw - notification failure shouldn't block assessment
      }

      // 7. Return full updated return request
      const updated = await this.getReturnRequestById(return_id);
      return updated;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Complete book return (after assessment and payment if needed)
   * @param {number} return_id - ID of return request
   * @returns {Object} Completed return request
   * @throws {Error} If validation fails
   */
  async completeReturn(return_id) {
    if (!return_id) {
      throw new Error('return_id is required');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Get return request with borrowing info
      const fullRequest = await this.getReturnRequestById(return_id);

      if (!fullRequest) {
        throw new Error('Return request not found');
      }

      // 2. Check status (must be assessed before completing)
      if (fullRequest.status !== 'assessed') {
        throw new Error(`Cannot complete return request with status: ${fullRequest.status}. Must be assessed first.`);
      }

      // 3. Update return request status
      await client.query(
        `UPDATE return_requests 
         SET status = 'completed', completed_at = CURRENT_TIMESTAMP 
         WHERE return_id = $1`,
        [return_id]
      );

      // 4. Update borrowing record status - MOVED to step 7

      // 5. Calculate new copy condition using librarian's damage percentage
      // Start from borrowed_condition (snapshot when borrowed)
      const damagePercent = fullRequest.damage_percentage || 0;
      let newCondition = Math.max(0, fullRequest.borrowed_condition - damagePercent);

      // 6. Update copy condition and price
      await client.query(
        `UPDATE book_copies 
         SET condition = $1, 
             copy_price = (SELECT price FROM book_titles WHERE book_id = $2) * $1 / 100 
         WHERE copy_id = $3`,
        [newCondition, fullRequest.book_id, fullRequest.copy_id]
      );

      // 7. Update statuses and availability based on assessment
      if (fullRequest.assessed_condition === 'LOST') {
        // Update book_copies for a LOST book
        await client.query(
          `UPDATE book_copies 
           SET status = 'lost', 
               condition = 0, 
               availability = FALSE,
               borrowed = FALSE
           WHERE copy_id = $1`,
          [fullRequest.copy_id]
        );
        // Update borrowing_records for a LOST book
        await client.query(
          `UPDATE borrowing_records 
           SET status = 'lost'
           WHERE borrow_id = $1`,
          [fullRequest.borrow_id]
        );
      } else {
        // Update book_copies for a NORMAL return
        await client.query(
          'UPDATE book_copies SET borrowed = FALSE WHERE copy_id = $1',
          [fullRequest.copy_id]
        );
        // Update borrowing_records for a NORMAL return
        await client.query(
          `UPDATE borrowing_records 
           SET status = 'returned'
           WHERE borrow_id = $1`,
          [fullRequest.borrow_id]
        );
      }

      // 8. Decrease user's borrow_count
      await client.query(
        `UPDATE users 
         SET borrow_count = GREATEST(0, borrow_count - 1) 
         WHERE user_id = $1`,
        [fullRequest.user_id]
      );

      await client.query('COMMIT');

      // 8. Return completed request
      const completed = await this.getReturnRequestById(return_id);
      return completed;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Get complete borrowing history for a reader
   * @param {number} reader_id - ID of the reader
   * @returns {Array} Array of borrowing history records
   */
  async getBorrowingHistory(reader_id) {
    if (!reader_id) {
      throw new Error('reader_id is required');
    }

    const query = `
      SELECT 
        br.borrow_id,
        br.copy_id,
        br.request_id,
        br.borrow_date,
        br.due_date,
        br.borrowed_copy_price,
        br.status,
        br.renew_count,
        bc.condition as current_copy_condition,
        bt.book_id,
        bt.title,
        bt.author,
        bt.publisher,
        bt.cover,
        bt.isbn,
        rr.completed_at as returned_date,
        rr.overdue_fee as late_fee,
        rr.damage_fee as damage_fee,
        rr.returned_condition as reader_returned_condition,
        rr.assessed_condition as librarian_assessed_condition,
        rr.total_fee as total_charge
      FROM borrowing_records br
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      LEFT JOIN return_requests rr ON br.borrow_id = rr.borrow_id AND rr.status = 'completed'
      WHERE br.reader_id = $1
      ORDER BY br.borrow_date DESC;
    `;

    const result = await pool.query(query, [reader_id]);
    return result.rows;
  }
};

module.exports = Borrowing;

