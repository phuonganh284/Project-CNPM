const { pool } = require('../config/database');

class Notification {
  
  static TYPES = {
    // Reader notifications
    REQUEST_APPROVED: 'REQUEST_APPROVED',           // Borrow request được duyệt
    REQUEST_REJECTED: 'REQUEST_REJECTED',           // Borrow request bị từ chối
    REQUEST_EXPIRED: 'REQUEST_EXPIRED',             // Approved request hết hạn (không pickup)
    BORROW_DUE_SOON: 'BORROW_DUE_SOON',            // Sách sắp đến hạn trả (3 days before)
    BORROW_OVERDUE: 'BORROW_OVERDUE',              // Sách quá hạn
    PENALTY_ISSUED: 'PENALTY_ISSUED',              // Có bill phí (assessment notification)
    
    // Librarian notifications
    NEW_BORROW_REQUEST: 'NEW_BORROW_REQUEST',      // Có borrow request mới
    NEW_RETURN_REQUEST: 'NEW_RETURN_REQUEST',      // Có return request mới
  };

  static async create(user_id, type_name, content, metadata = {}, client = pool) {
    if (!user_id || !type_name || !content) {
      throw new Error('user_id, type_name, and content are required');
    }

    // Get type_id from type_name
    const typeQuery = 'SELECT type_id FROM notification_types WHERE type_name = $1';
    const typeResult = await client.query(typeQuery, [type_name]);
    
    if (typeResult.rows.length === 0) {
      throw new Error(`Invalid notification type: ${type_name}`);
    }

    const type_id = typeResult.rows[0].type_id;

    const query = `
      INSERT INTO notifications (
        user_id,
        type_id,
        content,
        borrow_request_id,
        borrow_id,
        return_request_id,
        receipt_id,
        metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const result = await client.query(query, [
      user_id,
      type_id,
      content,
      metadata.borrow_request_id || null,
      metadata.borrow_id || null,
      metadata.return_request_id || null,
      metadata.receipt_id || null,
      metadata
    ]);

    return result.rows[0];
  }

  static async createRequestApproved(user_id, request_id, book_title, copy_id, pickup_date) {
    const content = `Your borrow request for "${book_title}" (Copy #${copy_id}) has been approved! Please pick up the book by ${pickup_date} before 20:00, or it will expire.`;
    
    const metadata = {
      borrow_request_id: request_id,
      book_title,
      copy_id,
      pickup_date
    };

    return await this.create(
      user_id,
      this.TYPES.REQUEST_APPROVED,
      content,
      metadata
    );
  }

  static async createRequestRejected(user_id, request_id, book_title, copy_id, rejection_reason, client = pool) {
    const content = `Your borrow request for "${book_title}" (Copy #${copy_id}) has been rejected. Reason: ${rejection_reason}`;
    
    const metadata = {
      borrow_request_id: request_id,
      book_title,
      copy_id,
      rejection_reason
    };

    return await this.create(
      user_id,
      this.TYPES.REQUEST_REJECTED,
      content,
      metadata,
      client
    );
  }

  static async createRequestExpired(user_id, request_id, book_title, copy_id, pickup_date) {
    const content = `Your approved request for "${book_title}" (Copy #${copy_id}) has expired. You did not pick up the book by ${pickup_date} 20:00. Please submit a new request if you still need it.`;
    
    const metadata = {
      borrow_request_id: request_id,
      book_title,
      copy_id,
      pickup_date
    };

    return await this.create(
      user_id,
      this.TYPES.REQUEST_EXPIRED,
      content,
      metadata
    );
  }

  static async createNewBorrowRequest(librarian_user_id, request_id, username, book_title, copy_id, pickup_date) {
    const content = `New borrow request from ${username} for "${book_title}".`;
    
    const metadata = {
      borrow_request_id: request_id,
      username,
      book_title,
      copy_id,
      pickup_date
    };

    return await this.create(
      librarian_user_id,
      this.TYPES.NEW_BORROW_REQUEST,
      content,
      metadata
    );
  }

  static async notifyLibrariansNewRequest(request_id, username, book_title, copy_id, pickup_date) {
    const query = `
      SELECT u.user_id 
      FROM librarians l
      JOIN users u ON l.user_id = u.user_id
      WHERE u.status = 'active'
    `;
    const result = await pool.query(query);
    
    const notifications = [];
    for (const row of result.rows) {
      try {
        const notif = await this.createNewBorrowRequest(
          row.user_id,
          request_id,
          username,
          book_title,
          copy_id,
          pickup_date
        );
        notifications.push(notif);
      } catch (error) {
        console.error(`Failed to notify librarian ${row.user_id}:`, error);
      }
    }
    
    return notifications;
  }

  static async findByUserId(user_id, unread_only = false) {
    if (!user_id) {
      throw new Error('user_id is required');
    }

    let query = `
      SELECT 
        n.notification_id,
        n.user_id,
        n.type_id,
        nt.type_name,
        nt.recipient_role,
        n.content,
        n.created_at,
        n.is_read,
        n.is_viewed,
        n.borrow_request_id,
        n.borrow_id,
        n.return_request_id,
        n.receipt_id,
        n.metadata
      FROM notifications n
      JOIN notification_types nt ON n.type_id = nt.type_id
      WHERE n.user_id = $1
    `;

    if (unread_only) {
      query += ' AND n.is_read = FALSE';
    }

    query += ' ORDER BY n.created_at DESC';

    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async markAsViewed(notification_id, user_id) {
    if (!notification_id || !user_id) {
      throw new Error('notification_id and user_id are required');
    }

    const query = `
      UPDATE notifications
      SET is_viewed = TRUE,
          is_read = TRUE
      WHERE notification_id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [notification_id, user_id]);
    
    if (result.rows.length === 0) {
      throw new Error('Notification not found or does not belong to this user');
    }

    return result.rows[0];
  }

  static async markAsRead(notification_id, user_id) {
    if (!notification_id || !user_id) {
      throw new Error('notification_id and user_id are required');
    }

    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE notification_id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [notification_id, user_id]);
    
    if (result.rows.length === 0) {
      throw new Error('Notification not found or does not belong to this user');
    }

    return result.rows[0];
  }

  static async markAllAsRead(user_id) {
    if (!user_id) {
      throw new Error('user_id is required');
    }

    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1 AND is_read = FALSE
      RETURNING notification_id
    `;

    const result = await pool.query(query, [user_id]);
    return result.rows.length;
  }

  static async countUnread(user_id) {
    if (!user_id) {
      throw new Error('user_id is required');
    }

    const query = `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = $1 AND is_read = FALSE
    `;

    const result = await pool.query(query, [user_id]);
    return parseInt(result.rows[0].count);
  }

  static async delete(notification_id, user_id) {
    if (!notification_id || !user_id) {
      throw new Error('notification_id and user_id are required');
    }

    const query = `
      DELETE FROM notifications
      WHERE notification_id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [notification_id, user_id]);
    
    if (result.rows.length === 0) {
      throw new Error('Notification not found or does not belong to this user');
    }

    return result.rows[0];
  }

  // ==================== RETURN WORKFLOW NOTIFICATIONS ====================

  static async createNewReturnRequest(librarian_user_id, return_id, borrow_id, reader_name, book_title, copy_id) {
    const content = `New return request from ${reader_name} for "${book_title}" (Copy #${copy_id}). Please assess the book condition.`;
    
    const metadata = {
      return_request_id: return_id,
      borrow_id,
      reader_name,
      book_title,
      copy_id
    };

    return await this.create(
      librarian_user_id,
      this.TYPES.NEW_RETURN_REQUEST,
      content,
      metadata
    );
  }

  static async notifyLibrariansNewReturnRequest(return_id, borrow_id, reader_name, book_title, copy_id) {
    // Lấy tất cả librarian user_ids
    const query = `
      SELECT u.user_id 
      FROM librarians l
      JOIN users u ON l.user_id = u.user_id
      WHERE u.status = 'active'
    `;
    const result = await pool.query(query);
    
    // Tạo notification cho từng librarian
    const notifications = [];
    for (const row of result.rows) {
      try {
        const notif = await this.createNewReturnRequest(
          row.user_id,
          return_id,
          borrow_id,
          reader_name,
          book_title,
          copy_id
        );
        notifications.push(notif);
      } catch (error) {
        console.error(`Failed to notify librarian ${row.user_id}:`, error);
      }
    }
    
    return notifications;
  }

  static async createAssessmentNotification(user_id, return_id, book_title, copy_id, assessed_condition, total_fee, overdue_fee, damage_fee) {
    let content;
    
    if (total_fee === 0) {
      content = `Your returned book "${book_title}" (Copy #${copy_id}) has been assessed: ${assessed_condition}. No fees required. Thank you!`;
    } else {
      const feeBreakdown = [];
      if (overdue_fee > 0) feeBreakdown.push(`Overdue fee: ${overdue_fee.toLocaleString()} đ`);
      if (damage_fee > 0) feeBreakdown.push(`Damage fee: ${damage_fee.toLocaleString()} đ`);
      
      content = `Your returned book "${book_title}" (Copy #${copy_id}) has been assessed: ${assessed_condition}. Total fee: ${total_fee.toLocaleString()} đ (${feeBreakdown.join(', ')}). Please complete payment to finalize return.`;
    }
    
    const metadata = {
      return_request_id: return_id,
      book_title,
      copy_id,
      assessed_condition,
      total_fee,
      overdue_fee,
      damage_fee
    };

    return await this.create(
      user_id,
      this.TYPES.PENALTY_ISSUED,
      content,
      metadata
    );
  }

  static async createDueSoonNotification(user_id, borrow_id, book_title, copy_id, due_date, days_remaining) {
    const content = `Reminder: "${book_title}" (Copy #${copy_id}) is due in ${days_remaining} day${days_remaining > 1 ? 's' : ''} (${due_date}). Please return or renew before the due date to avoid late fees.`;
    
    const metadata = {
      borrow_id,
      book_title,
      copy_id,
      due_date,
      days_remaining
    };

    return await this.create(
      user_id,
      this.TYPES.BORROW_DUE_SOON,
      content,
      metadata
    );
  }

  static async createOverdueNotification(user_id, borrow_id, book_title, copy_id, days_overdue) {
    const content = `OVERDUE: "${book_title}" (Copy #${copy_id}) is ${days_overdue} day${days_overdue > 1 ? 's' : ''} overdue. Please return immediately to minimize late fees.`;
    
    const metadata = {
      borrow_id,
      book_title,
      copy_id,
      days_overdue
    };

    return await this.create(
      user_id,
      this.TYPES.BORROW_OVERDUE,
      content,
      metadata
    );
  }
}

module.exports = Notification;

