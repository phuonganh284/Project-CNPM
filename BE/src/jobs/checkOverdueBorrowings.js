const { pool } = require('../config/database');
const Notification = require('../models/notification.model');

async function checkOverdueBorrowings() {
  console.log('[CRON] Starting checkOverdueBorrowings job...');

  try {
    // Query for approved borrowings that are now past their due_date
    const query = `
      SELECT 
        br.borrow_id,
        br.copy_id,
        br.due_date,
        bt.title as book_title,
        u.user_id,
        u.name as reader_name,
        (CURRENT_DATE - br.due_date::date) as days_overdue
      FROM borrowing_records br
      JOIN readers r ON br.reader_id = r.reader_id
      JOIN users u ON r.user_id = u.user_id
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      WHERE br.status = 'approved'
        AND br.due_date < CURRENT_TIMESTAMP
    `;

    const result = await pool.query(query);
    const overdueBorrowings = result.rows;

    if (overdueBorrowings.length === 0) {
      console.log('[CRON] No overdue borrowings found.');
      return;
    }

    console.log(`[CRON] Found ${overdueBorrowings.length} overdue borrowing(s).`);

    for (const borrowing of overdueBorrowings) {
      try {
        // To prevent spamming, check if an overdue notification has been sent in the last 24 hours for this borrowing
        const existingNotifQuery = `
          SELECT 1 FROM notifications
          WHERE borrow_id = $1
            AND type_id = (SELECT type_id FROM notification_types WHERE type_name = 'BORROW_OVERDUE')
            AND created_at >= NOW() - INTERVAL '24 hours'
        `;
        const existingNotifResult = await pool.query(existingNotifQuery, [borrowing.borrow_id]);

        if (existingNotifResult.rows.length > 0) {
          console.log(`[CRON] Overdue notification already sent for borrow_id ${borrowing.borrow_id} in the last 24 hours. Skipping.`);
          continue;
        }

        await Notification.createOverdueNotification(
          borrowing.user_id,
          borrowing.borrow_id,
          borrowing.book_title,
          borrowing.copy_id,
          borrowing.days_overdue
        );

        console.log(`[CRON] ✓ Sent OVERDUE notification to ${borrowing.reader_name} for "${borrowing.book_title}".`);

      } catch (error) {
        console.error(`[CRON] ✗ Failed to process overdue notification for borrow_id ${borrowing.borrow_id}:`, error);
      }
    }

    console.log(`[CRON] checkOverdueBorrowings job finished.`);

  } catch (error) {
    console.error('[CRON] Error in checkOverdueBorrowings job:', error);
  }
}

module.exports = { checkOverdueBorrowings };
