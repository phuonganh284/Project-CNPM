const { pool } = require('../config/database');
const { formatResponse, formatError } = require('../utils/responseFormatter');

class DashboardController {
  /**
   * Get dashboard statistics for librarian
   * @route GET /api/dashboard/stats
   */
  static async getStats(req, res) {
    try {
      // 1. Total Books
      const totalBooksQuery = 'SELECT COUNT(*) as count FROM book_titles';
      const totalBooksResult = await pool.query(totalBooksQuery);
      const totalBooks = parseInt(totalBooksResult.rows[0].count);

      // 2. Available Books (copies available)
      const availableBooksQuery = `
        SELECT COUNT(*) as count 
        FROM book_copies 
        WHERE availability = TRUE
      `;
      const availableBooksResult = await pool.query(availableBooksQuery);
      const availableBooks = parseInt(availableBooksResult.rows[0].count);

      // 3. Borrowed Books (active borrowings)
      const borrowedBooksQuery = `
        SELECT COUNT(*) as count 
        FROM borrowing_records 
        WHERE status = 'approved'
      `;
      const borrowedBooksResult = await pool.query(borrowedBooksQuery);
      const borrowedBooks = parseInt(borrowedBooksResult.rows[0].count);

      // 4. Total Readers
      const totalReadersQuery = 'SELECT COUNT(*) as count FROM readers';
      const totalReadersResult = await pool.query(totalReadersQuery);
      const totalReaders = parseInt(totalReadersResult.rows[0].count);

      // 5. Active Readers (có active borrowing)
      const activeReadersQuery = `
        SELECT COUNT(DISTINCT reader_id) as count 
        FROM borrowing_records 
        WHERE status = 'approved'
      `;
      const activeReadersResult = await pool.query(activeReadersQuery);
      const activeReaders = parseInt(activeReadersResult.rows[0].count);

      // 6. Pending Requests
      const pendingRequestsQuery = `
        SELECT COUNT(*) as count 
        FROM borrow_requests 
        WHERE status = 'pending'
      `;
      const pendingRequestsResult = await pool.query(pendingRequestsQuery);
      const pendingRequests = parseInt(pendingRequestsResult.rows[0].count);

      // 7. Approved Requests (waiting for pickup)
      const approvedRequestsQuery = `
        SELECT COUNT(*) as count 
        FROM borrow_requests 
        WHERE status = 'approved'
      `;
      const approvedRequestsResult = await pool.query(approvedRequestsQuery);
      const approvedRequests = parseInt(approvedRequestsResult.rows[0].count);

      // 8. Return Requests (pending assessment)
      const returnRequestsQuery = `
        SELECT COUNT(*) as count 
        FROM return_requests 
        WHERE status = 'pending'
      `;
      const returnRequestsResult = await pool.query(returnRequestsQuery);
      const returnRequests = parseInt(returnRequestsResult.rows[0].count);

      // 9. Overdue Books
      const overdueQuery = `
        SELECT COUNT(*) as count 
        FROM borrowing_records 
        WHERE status = 'approved' 
          AND due_date < CURRENT_TIMESTAMP
      `;
      const overdueResult = await pool.query(overdueQuery);
      const overdueBooks = parseInt(overdueResult.rows[0].count);

      // 10. Total Revenue (late fees collected this month)
      const revenueQuery = `
        SELECT COALESCE(SUM(total_fee), 0) as total 
        FROM borrow_history 
        WHERE return_date >= DATE_TRUNC('month', CURRENT_DATE)
          AND return_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      `;
      const revenueResult = await pool.query(revenueQuery);
      const totalRevenue = parseFloat(revenueResult.rows[0].total) || 0;

      const stats = {
        totalBooks,
        availableBooks,
        borrowedBooks,
        totalReaders,
        activeReaders,
        pendingRequests,
        approvedRequests,
        returnRequests,
        overdueBooks,
        totalRevenue: Math.round(totalRevenue / 25000) // Convert VND to USD for display
      };

      return res.status(200).json(
        formatResponse(stats, 'Dashboard statistics retrieved successfully')
      );

    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return res.status(500).json(
        formatError(error, 'Failed to retrieve dashboard statistics', 500)
      );
    }
  }

  /**
   * Get recent activities for dashboard
   * @route GET /api/dashboard/recent-activities
   * @query limit (default 10)
   */
  static async getRecentActivities(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;

      // Get recent borrow requests, return requests, and borrowings
      // Combine them with UNION and sort by time
      const query = `
        (
          SELECT 
            'BORROW_REQUEST' as type,
            br.request_id as id,
            u.name as user_name,
            bt.title as book_title,
            br.request_date as activity_time,
            br.status
          FROM borrow_requests br
          JOIN readers r ON br.reader_id = r.reader_id
          JOIN users u ON r.user_id = u.user_id
          JOIN book_copies bc ON br.copy_id = bc.copy_id
          JOIN book_titles bt ON bc.book_id = bt.book_id
          WHERE br.request_date >= CURRENT_TIMESTAMP - INTERVAL '7 days'
        )
        UNION ALL
        (
          SELECT 
            'RETURN_REQUEST' as type,
            rr.return_id as id,
            u.name as user_name,
            bt.title as book_title,
            rr.request_date as activity_time,
            rr.status
          FROM return_requests rr
          JOIN borrowing_records br ON rr.borrow_id = br.borrow_id
          JOIN readers r ON br.reader_id = r.reader_id
          JOIN users u ON r.user_id = u.user_id
          JOIN book_copies bc ON br.copy_id = bc.copy_id
          JOIN book_titles bt ON bc.book_id = bt.book_id
          WHERE rr.status = 'pending' AND rr.request_date >= CURRENT_TIMESTAMP - INTERVAL '7 days'
        )
        UNION ALL
        (
          SELECT 
            CASE 
              WHEN br.due_date < CURRENT_TIMESTAMP THEN 'OVERDUE'
              ELSE 'APPROVED'
            END as type,
            br.borrow_id as id,
            u.name as user_name,
            bt.title as book_title,
            br.borrow_date as activity_time,
            br.status
          FROM borrowing_records br
          JOIN readers r ON br.reader_id = r.reader_id
          JOIN users u ON r.user_id = u.user_id
          JOIN book_copies bc ON br.copy_id = bc.copy_id
          JOIN book_titles bt ON bc.book_id = bt.book_id
          WHERE br.status = 'approved'
            AND br.borrow_date >= CURRENT_TIMESTAMP - INTERVAL '7 days'
        )
        ORDER BY activity_time DESC
        LIMIT $1
      `;

      const result = await pool.query(query, [limit]);

      // Format activities with relative time
      const activities = result.rows.map(row => {
        const activityTime = new Date(row.activity_time);
        const now = new Date();
        const diffMs = now - activityTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let timeAgo;
        if (diffMins < 1) {
          timeAgo = 'Just now';
        } else if (diffMins < 60) {
          timeAgo = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
          timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
          timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }

        return {
          id: row.id,
          type: row.type,
          user: row.user_name,
          book: row.book_title,
          time: timeAgo,
          status: row.status
        };
      });

      return res.status(200).json(
        formatResponse(activities, 'Recent activities retrieved successfully')
      );

    } catch (error) {
      console.error('Error getting recent activities:', error);
      return res.status(500).json(
        formatError(error, 'Failed to retrieve recent activities', 500)
      );
    }
  }

  /**
   * Get most borrowed books (top 10)
   * @route GET /api/dashboard/popular-books
   * @query limit (default 10)
   */
  static async getPopularBooks(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const popularBooks = await DashboardController.getPopularBooksData(limit);
      return res.status(200).json(
        formatResponse(popularBooks, 'Popular books retrieved successfully')
      );
    } catch (error) {
      console.error('Error getting popular books:', error);
      return res.status(500).json(
        formatError(error, 'Failed to retrieve popular books', 500)
      );
    }
  }

  /**
   * Get all dashboard data in one request (for performance)
   * @route GET /api/dashboard
   */
  static async getDashboard(req, res) {
    try {
      // Run all queries in parallel for better performance
      const [statsResult, activitiesResult, popularBooksResult] = await Promise.all([
        DashboardController.getStatsData(),
        DashboardController.getRecentActivitiesData(10),
        DashboardController.getPopularBooksData(3)
      ]);

      const dashboardData = {
        stats: statsResult,
        recentActivities: activitiesResult,
        popularBooks: popularBooksResult
      };

      return res.status(200).json(
        formatResponse(dashboardData, 'Dashboard data retrieved successfully')
      );

    } catch (error) {
      console.error('Error getting dashboard:', error);
      return res.status(500).json(
        formatError(error, 'Failed to retrieve dashboard data', 500)
      );
    }
  }

  // Helper methods for getDashboard (reusable logic)
  static async getStatsData() {
    const queries = {
      totalBooks: 'SELECT COUNT(*) as count FROM book_titles',
      availableBooks: 'SELECT COUNT(*) as count FROM book_copies WHERE availability = TRUE',
      borrowedBooks: 'SELECT COUNT(*) as count FROM borrowing_records WHERE status = $1',
      totalReaders: 'SELECT COUNT(*) as count FROM readers',
      activeReaders: 'SELECT COUNT(DISTINCT reader_id) as count FROM borrowing_records WHERE status = $1',
      pendingRequests: 'SELECT COUNT(*) as count FROM borrow_requests WHERE status = $1',
      approvedRequests: 'SELECT COUNT(*) as count FROM borrow_requests WHERE status = $1',
      returnRequests: 'SELECT COUNT(*) as count FROM return_requests WHERE status = $1',
      overdueBooks: 'SELECT COUNT(*) as count FROM borrowing_records WHERE status = $1 AND due_date < CURRENT_TIMESTAMP',
      totalRevenue: `SELECT COALESCE(SUM(total_fee), 0) as total FROM borrow_history 
                     WHERE return_date >= DATE_TRUNC('month', CURRENT_DATE)
                     AND return_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'`
    };

    const results = await Promise.all([
      pool.query(queries.totalBooks),
      pool.query(queries.availableBooks),
      pool.query(queries.borrowedBooks, ['approved']),
      pool.query(queries.totalReaders),
      pool.query(queries.activeReaders, ['approved']),
      pool.query(queries.pendingRequests, ['pending']),
      pool.query(queries.approvedRequests, ['approved']),
      pool.query(queries.returnRequests, ['pending']),
      pool.query(queries.overdueBooks, ['approved']),
      pool.query(queries.totalRevenue)
    ]);

    const revenueFromDB = results[9].rows[0].total;
    const finalRevenue = parseFloat((parseFloat(revenueFromDB) / 25000).toFixed(2));

    // --- REVENUE DEBUG LOG ---
    console.log(`[DEBUG] Raw total_fee sum from DB: ${revenueFromDB}`);
    console.log(`[DEBUG] Final calculated totalRevenue (USD): ${finalRevenue}`);
    // -------------------------

    return {
      totalBooks: parseInt(results[0].rows[0].count),
      availableBooks: parseInt(results[1].rows[0].count),
      borrowedBooks: parseInt(results[2].rows[0].count),
      totalReaders: parseInt(results[3].rows[0].count),
      activeReaders: parseInt(results[4].rows[0].count),
      pendingRequests: parseInt(results[5].rows[0].count),
      approvedRequests: parseInt(results[6].rows[0].count),
      returnRequests: parseInt(results[7].rows[0].count),
      overdueBooks: parseInt(results[8].rows[0].count),
      totalRevenue: parseFloat(results[9].rows[0].total) || 0
    };
  }

  static async getRecentActivitiesData(limit = 10) {
    const query = `
      (
        SELECT 
          'BORROW_REQUEST' as type,
          br.request_id as id,
          u.name as user_name,
          bt.title as book_title,
          br.request_date as activity_time,
          br.status
        FROM borrow_requests br
        JOIN readers r ON br.reader_id = r.reader_id
        JOIN users u ON r.user_id = u.user_id
        JOIN book_copies bc ON br.copy_id = bc.copy_id
        JOIN book_titles bt ON bc.book_id = bt.book_id
        WHERE br.request_date >= CURRENT_TIMESTAMP - INTERVAL '7 days'
      )
      UNION ALL
      (
        SELECT 
          'RETURN_REQUEST' as type,
          rr.return_id as id,
          u.name as user_name,
          bt.title as book_title,
          rr.request_date as activity_time,
          rr.status
        FROM return_requests rr
        JOIN borrowing_records br ON rr.borrow_id = br.borrow_id
        JOIN readers r ON br.reader_id = r.reader_id
        JOIN users u ON r.user_id = u.user_id
                  JOIN book_copies bc ON br.copy_id = bc.copy_id
                  JOIN book_titles bt ON bc.book_id = bt.book_id
                  WHERE rr.status = 'pending' AND rr.request_date >= CURRENT_TIMESTAMP - INTERVAL '7 days'      )
      UNION ALL
      (
        SELECT 
          CASE 
            WHEN br.due_date < CURRENT_TIMESTAMP THEN 'OVERDUE'
            ELSE 'APPROVED'
          END as type,
          br.borrow_id as id,
          u.name as user_name,
          bt.title as book_title,
          br.borrow_date as activity_time,
          br.status
        FROM borrowing_records br
        JOIN readers r ON br.reader_id = r.reader_id
        JOIN users u ON r.user_id = u.user_id
        JOIN book_copies bc ON br.copy_id = bc.copy_id
        JOIN book_titles bt ON bc.book_id = bt.book_id
        WHERE br.status = 'approved'
          AND br.borrow_date >= CURRENT_TIMESTAMP - INTERVAL '7 days'
      )
      ORDER BY activity_time DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);

    return result.rows.map(row => {
      const activityTime = new Date(row.activity_time);
      const now = new Date();
      const diffMs = now - activityTime;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let timeAgo;
      if (diffMins < 1) {
        timeAgo = 'Just now';
      } else if (diffMins < 60) {
        timeAgo = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      }

      return {
        id: row.id,
        type: row.type,
        user: row.user_name,
        book: row.book_title,
        time: timeAgo,
        status: row.status
      };
    });
  }

  static async getPopularBooksData(limit = 10) {
    const query = `
      SELECT 
        book_id,
        title,
        author,
        cover,
        borrow_count
      FROM book_titles
      ORDER BY borrow_count DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);

    return result.rows.map(row => ({
      id: row.book_id,
      title: row.title,
      author: row.author,
      coverUrl: row.cover || 'https://via.placeholder.com/167x203?text=No+Cover',
      borrowCount: parseInt(row.borrow_count)
    }));
  }
}

module.exports = DashboardController;
