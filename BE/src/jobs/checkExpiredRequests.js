const { pool } = require('../config/database');
const Notification = require('../models/notification.model');

async function checkExpiredRequests() {
  console.log('[CRON] Checking expired borrow requests...');
  
  try {
    const query = `
      SELECT 
        br.request_id,
        br.reader_id,
        br.copy_id,
        br.pickup_date,
        br.request_date,
        bt.title,
        bc.book_id,
        u.user_id,
        u.name as reader_name,
        u.email as reader_email
      FROM borrow_requests br
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      JOIN readers r ON br.reader_id = r.reader_id
      JOIN users u ON r.user_id = u.user_id
      WHERE br.status = 'approved'
        AND br.pickup_date + INTERVAL '20 hours' < NOW()
      ORDER BY br.pickup_date ASC
    `;
    
    const result = await pool.query(query);
    const expiredRequests = result.rows;
    
    if (expiredRequests.length === 0) {
      console.log('[CRON] No expired requests found.');
      return { processed: 0, success: 0, failed: 0 };
    }
    
    console.log(`[CRON] Found ${expiredRequests.length} expired request(s)`);
    
    let successCount = 0;
    let failedCount = 0;
    
    for (const req of expiredRequests) {
      try {
        // a. Delete request khỏi database
        const deleteQuery = `
          DELETE FROM borrow_requests 
          WHERE request_id = $1
          RETURNING request_id
        `;
        const deleteResult = await pool.query(deleteQuery, [req.request_id]);
        
        if (deleteResult.rows.length === 0) {
          console.error(`[CRON] Failed to delete request ${req.request_id} - already deleted?`);
          failedCount++;
          continue;
        }
        
        // b. Format pickup_date
        const pickupDateFormatted = new Date(req.pickup_date)
          .toLocaleDateString('en-GB')
          .replace(/\//g, '-');
        
        // c. notification for reader
        await Notification.createRequestExpired(
          req.user_id,
          req.request_id,
          req.title,
          req.copy_id,
          pickupDateFormatted
        );
        
        console.log(`[CRON] ✓ Processed expired request ${req.request_id} for "${req.title}" (${req.reader_name})`);
        successCount++;
        
      } catch (error) {
        console.error(`[CRON] ✗ Error processing request ${req.request_id}:`, error.message);
        failedCount++;
      }
    }
    
    console.log(`[CRON] Completed: ${successCount} processed, ${failedCount} failed`);
    
    return {
      processed: expiredRequests.length,
      success: successCount,
      failed: failedCount
    };
    
  } catch (error) {
    console.error('[CRON] Error in checkExpiredRequests:', error);
    throw error;
  }
}

module.exports = { checkExpiredRequests };
