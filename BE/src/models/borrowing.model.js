const { pool } = require('../config/database');
const Notification = require('./notification.model');
const BookTitle = require('./bookTitle.model');
const CopyModel = require('./copyModel');

const Borrowing = {
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
        u.username,
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

  async createFromRequest(request_id) {
    if (!request_id) {
        throw new Error('request_id is required');
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Get request details and lock the copy for update
        const requestQuery = `
            SELECT 
                br.reader_id, 
                br.copy_id,
                br.status,
                bc.book_id,
                bc.availability,
                bc.condition as copy_condition,
                bc.copy_price,
                u.user_id
            FROM borrow_requests br
            JOIN book_copies bc ON br.copy_id = bc.copy_id
            JOIN readers r ON br.reader_id = r.reader_id
            JOIN users u ON r.user_id = u.user_id
            WHERE br.request_id = $1
            FOR UPDATE OF bc;
        `;
        const requestResult = await client.query(requestQuery, [request_id]);
        
        if (requestResult.rows.length === 0) {
            throw new Error('Borrow request not found.');
        }
        
        const request = requestResult.rows[0];

        // 2. Validate request
        if (request.status !== 'approved') {
            throw new Error(`Cannot create borrowing from request with status: ${request.status}`);
        }
        if (!request.availability) {
            throw new Error('Copy is no longer available for borrowing.');
        }

        // 3. Calculate due_date (NOW + 30 days)
        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + 30);

        // 4. Create the borrowing record, now including the borrowed_condition
        const insertBorrowingQuery = `
            INSERT INTO borrowing_records (reader_id, copy_id, request_id, borrow_date, due_date, status, borrowed_condition, borrowed_copy_price)
            VALUES ($1, $2, $3, $4, $5, 'approved', $6, $7)
            RETURNING borrow_id;
        `;
        const borrowingResult = await client.query(insertBorrowingQuery, [
            request.reader_id, 
            request.copy_id, 
            request_id, 
            borrowDate, 
            dueDate, 
            request.copy_condition,
            request.copy_price
        ]);
        const newBorrowId = borrowingResult.rows[0].borrow_id;

        // 5. Update user's borrow count
        await client.query('UPDATE users SET borrowcount = borrowcount + 1 WHERE user_id = $1', [request.user_id]);
        
        // 6. Increment book_titles.borrow_count
        await client.query('UPDATE book_titles SET borrow_count = borrow_count + 1 WHERE book_id = $1', [request.book_id]);

        // 7. Delete the now-processed borrow request
        await client.query('DELETE FROM borrow_requests WHERE request_id = $1', [request_id]);

        await client.query('COMMIT');
        
        // Fetch the newly created borrowing record with full details
        const newBorrowingRecord = await this.findById(newBorrowId);
        console.log("Debug: newBorrowingRecord returned by createFromRequest:", newBorrowingRecord);
        return newBorrowingRecord;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
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
        END as "isOverdue",
        (br.renew_count > 0) as renewed,
        EXISTS (
          SELECT 1 
          FROM return_requests rr 
          WHERE rr.borrow_id = br.borrow_id AND rr.status IN ('pending', 'assessed')
        ) AS "isPendingReturn",
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - br.due_date)) as days_overdue,
        rr_completed.completed_at as returned_date, -- Actual return date
        rr_completed.overdue_fee as late_fee,
        rr_completed.damage_fee as damage_fee,
        rr_completed.returned_condition as returned_condition_by_reader, -- Reader's assessed condition
        rr_completed.assessed_condition as final_assessed_condition, -- Librarian's assessed condition
        rr_completed.total_fee as total_charge
      FROM borrowing_records br
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      LEFT JOIN return_requests rr_completed ON br.borrow_id = rr_completed.borrow_id AND rr_completed.status = 'completed'
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
        br.borrowed_condition as "borrowedCondition", -- Select the snapshot condition
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
        END as "isOverdue",
        (br.renew_count > 0) as renewed,
        EXISTS (
          SELECT 1 
          FROM return_requests rr 
          WHERE rr.borrow_id = br.borrow_id AND rr.status IN ('pending', 'assessed')
        ) AS "isPendingReturn",
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

      // 5. Update borrowing_records status to 'pending'
      await client.query(
        `UPDATE borrowing_records SET status = 'pending' WHERE borrow_id = $1`,
        [borrow_id]
      );

      // 6. Get full borrowing info for notification
      const borrowingInfo = await client.query(`
        SELECT 
          br.copy_id,
          br.borrow_date,
          br.due_date,
          bt.title,
          bt.author,
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

      // Calculate days_overdue
      const currentDate = new Date();
      const dueDate = new Date(borrowInfo.due_date);
      const daysOverdue = Math.max(0, Math.ceil((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));

      await client.query('COMMIT');

      // 7. Notify all librarians about new return request
      try {
        await Notification.notifyLibrariansNewReturnRequest(
          result.rows[0].return_id,
          borrow_id,
          borrowInfo.reader_name,
          borrowInfo.title,
          borrowInfo.author, // Pass author
          borrowInfo.copy_id,
          borrowInfo.borrow_date, // Pass borrowed_date
          borrowInfo.due_date,   // Pass due_date
          daysOverdue            // Pass days_overdue
        );
      } catch (notifError) {
        console.error('Failed to notify librarians about new return request:', notifError);
      }

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
        br.borrowed_condition,
        bc.condition as current_condition,
        bt.book_id,
        bt.title,
        bt.author,
        bt.publish_year,
        bt.cover,
        bt.price as book_price,
        u.user_id,
        u.username, -- Added username to select clause
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
    } else {
      query += ` WHERE rr.status IN ('pending', 'assessed')`;
    }

    query += ' ORDER BY rr.request_date DESC';

    const result = await pool.query(query, params);
    
    // Transform the flat data into the nested structure expected by the frontend
    const transformedRequests = result.rows.map(row => ({
      id: row.return_id,
      borrow_id: row.borrow_id,
      copyId: row.copy_id,
      status: row.status,
      assessed_condition: row.assessed_condition,
      returned_condition: row.returned_condition,
      borrowedCondition: row.borrowed_condition,
      due_date: row.due_date,
      fine: row.total_fee,
      request_date: row.request_date,
      assessed_at: row.assessed_at,
      book: {
        id: row.book_id,
        title: row.title,
        author: row.author,
        publication_year: row.publish_year,
        cover_image_url: row.cover,
        price: row.book_price,
      },
      user: {
        id: row.user_id,
        full_name: row.username, // Changed to use username
        email: row.reader_email,
      }
    }));

    return transformedRequests;
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

      const requestCheck = await client.query(`
        SELECT 
          rr.*,
          br.due_date,
          br.borrowed_copy_price,
          bc.condition as current_copy_condition,
          bc.copy_id,
          bt.book_id,
          bt.title,
          bt.price as book_title_price,
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

      if (request.status !== 'pending') {
        throw new Error(`Cannot assess return request with status: ${request.status}`);
      }
      
      // Calculate overdue fee
      const dueDate = new Date(request.due_date);
      const today = new Date();
      const daysLate = Math.max(0, Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)));
      const overdueRate = 1; // 1% of book's value per day
      const overdueFee = Math.round((daysLate * overdueRate * request.borrowed_copy_price) / 100);

      const damageFee = request.borrowed_copy_price * damage_percentage / 100;
      const total_fee = overdueFee + damageFee;

      await client.query(
        `UPDATE return_requests
         SET status = 'assessed', assessed_condition = $1, damage_percentage = $2, overdue_fee = $3, damage_fee = $4, total_fee = $5, assessment_notes = $6, assessed_at = CURRENT_TIMESTAMP
         WHERE return_id = $7`,
        [assessed_condition, damage_percentage, overdueFee, damageFee, total_fee, assessment_notes || null, return_id]
      );

      const newCondition = Math.max(0, request.current_copy_condition - damage_percentage);
      const newCopyPrice = request.book_title_price * newCondition / 100;

      // Prepare the update query for the book copy
      let updateCopyQuery = `UPDATE book_copies SET condition = $1, copy_price = $2`;
      const queryParams = [newCondition, newCopyPrice];

      // If the book is assessed as LOST, also update its status and availability
      if (assessed_condition === 'LOST') {
        updateCopyQuery += `, status = 'lost', availability = FALSE`;
      }

      updateCopyQuery += ` WHERE copy_id = $3`;
      queryParams.push(request.copy_id);

      // Execute the update query
      await client.query(updateCopyQuery, queryParams);

      await client.query('COMMIT');

      try {
        await Notification.createAssessmentNotification(
          request.user_id, return_id, request.title, request.copy_id,
          assessed_condition, total_fee, overdueFee, damageFee
        );
      } catch (notifError) {
        console.error('Failed to send assessment notification to reader:', notifError);
      }

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

      // Step 1: Get all details from the return_request and its associated borrow_record.
      const fullRequest = await this.getReturnRequestById(return_id);
      if (!fullRequest) {
        throw new Error('Return request not found');
      }

      if (fullRequest.status !== 'assessed') {
        throw new Error(`Cannot complete return request with status: ${fullRequest.status}. Must be assessed first.`);
      }

      // Step 2: Determine the final status for the history record.
      const historyStatus = new Date() > new Date(fullRequest.due_date) ? 'overdue' : 'on-time';

      // Step 3: Insert the enriched, self-contained record into borrow_history.
      const historyInsertQuery = `
        INSERT INTO borrow_history (
          reader_id, borrow_id, copy_id, return_id,
          borrow_date, due_date, return_date,
          borrowed_copy_price, status,
          late_fee, damage_fee, total_fee,
          librarian_assessed_condition, reader_returned_condition, assessment_notes
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7, $8, $9, $10, $11, $12, $13, $14)
      `;
      await client.query(historyInsertQuery, [
        fullRequest.reader_id, fullRequest.borrow_id, fullRequest.copy_id, return_id,
        fullRequest.borrow_date, fullRequest.due_date,
        fullRequest.borrowed_copy_price, historyStatus,
        fullRequest.overdue_fee, fullRequest.damage_fee, fullRequest.total_fee,
        fullRequest.assessed_condition, fullRequest.returned_condition, fullRequest.assessment_notes
      ]);

      // Step 4: Delete the now-archived return_request.
      await client.query(
        `DELETE FROM return_requests WHERE return_id = $1`,
        [return_id]
      );

      // Step 5: Delete the record from borrowing_records.
      await client.query(
        `DELETE FROM borrowing_records WHERE borrow_id = $1`,
        [fullRequest.borrow_id]
      );

      // Step 6: Set the copy as no longer borrowed and available.
      await CopyModel.setBorrowedStatus(fullRequest.copy_id, false, client);
      
      // Step 7: Recalculate available stock for the book title.
      await BookTitle.updateAvailableStock(fullRequest.book_id, client);

      // Step 8: Decrease user's borrow count.
      await client.query(
        `UPDATE users SET borrowcount = GREATEST(0, borrowcount - 1) WHERE user_id = $1`,
        [fullRequest.user_id]
      );

      await client.query('COMMIT');

      return { success: true, message: `Return for borrow_id ${fullRequest.borrow_id} completed and archived.` };

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

    // The main table is now borrow_history, which is self-contained and enriched.
    const query = `
      SELECT 
        bh.*, -- Select all columns from borrow_history
        bt.book_id,
        bt.title,
        bt.author,
        bt.publisher,
        bt.cover,
        bt.isbn,
        u.user_id,
        u.username,
        u.name as reader_name,
        u.email as reader_email
      FROM borrow_history bh
      -- Join to get book and user details
      JOIN book_copies bc ON bh.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      JOIN readers r ON bh.reader_id = r.reader_id
      JOIN users u ON r.user_id = u.user_id
      WHERE bh.reader_id = $1
      ORDER BY bh.borrow_date DESC;
    `;

    const result = await pool.query(query, [reader_id]);
    
    // Transform the flat data into the nested structure expected by the frontend
    const transformedHistory = result.rows.map(row => ({
      id: row.borrow_id,
      borrow_id: row.borrow_id,
      copy_id: row.copy_id,
      borrow_date: row.borrow_date,
      due_date: row.due_date,
      borrowed_copy_price: row.borrowed_copy_price,
      status: row.status, // status from borrow_history
      returned_date: row.return_date,
      late_fee: row.late_fee,
      damage_fee: row.damage_fee,
      total_charge: row.total_fee,
      reader_returned_condition: row.reader_returned_condition,
      librarian_assessed_condition: row.librarian_assessed_condition,
      book: {
        id: row.book_id,
        title: row.title,
        author: row.author,
        publisher: row.publisher,
        cover_image_url: row.cover,
        isbn: row.isbn,
      },
      user: {
        id: row.user_id,
        username: row.username,
        full_name: row.reader_name,
        email: row.reader_email,
      }
    }));

    return transformedHistory;
  }
};

module.exports = Borrowing;

