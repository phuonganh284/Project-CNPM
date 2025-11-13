const { pool } = require('../config/database');
const Notification = require('../models/notification.model');

async function checkDueSoonBorrowings() {
  console.log('[CRON] Starting checkDueSoonBorrowings job...');

  try {
    // Query borrowings that are due in 1, 2, or 3 days
    const query = `
      SELECT 
        br.borrow_id,
        br.reader_id,
        br.copy_id,
        br.due_date,
        bt.title,
        u.user_id,
        u.name as reader_name,
        EXTRACT(DAY FROM (br.due_date - CURRENT_TIMESTAMP)) as days_remaining
      FROM borrowing_records br
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      JOIN readers r ON br.reader_id = r.reader_id
      JOIN users u ON r.user_id = u.user_id
      WHERE br.status = 'approved'
        AND br.due_date > CURRENT_TIMESTAMP
        AND br.due_date <= CURRENT_TIMESTAMP + INTERVAL '3 days'
      ORDER BY br.due_date ASC
    `;

    const result = await pool.query(query);
    const borrowings = result.rows;

    console.log(`[CRON] Found ${borrowings.length} borrowing(s) due soon`);

    let successCount = 0;
    let errorCount = 0;

    for (const borrowing of borrowings) {
      try {
        const daysRemaining = Math.ceil(borrowing.days_remaining);
        
        // Format due date
        const dueDate = new Date(borrowing.due_date);
        const dueDateFormatted = dueDate.toLocaleDateString('en-GB'); // DD/MM/YYYY

        // Check if notification already sent today for this borrowing
        const existingNotif = await pool.query(`
          SELECT notification_id 
          FROM notifications 
          WHERE borrow_id = $1 
            AND type_id = (SELECT type_id FROM notification_types WHERE type_name = 'BORROW_DUE_SOON')
            AND created_at > CURRENT_DATE
        `, [borrowing.borrow_id]);

        if (existingNotif.rows.length > 0) {
          console.log(`[CRON] Notification already sent today for borrow_id ${borrowing.borrow_id}`);
          continue;
        }

        // Send reminder notification
        await Notification.createDueSoonNotification(
          borrowing.user_id,
          borrowing.borrow_id,
          borrowing.title,
          borrowing.copy_id,
          dueDateFormatted,
          daysRemaining
        );

        console.log(`[CRON] ✓ Sent reminder to ${borrowing.reader_name} for "${borrowing.title}" (due in ${daysRemaining} day(s))`);
        successCount++;

      } catch (error) {
        console.error(`[CRON] ✗ Failed to send reminder for borrow_id ${borrowing.borrow_id}:`, error);
        errorCount++;
      }
    }

    console.log(`[CRON] checkDueSoonBorrowings completed: ${successCount} success, ${errorCount} errors`);

  } catch (error) {
    console.error('[CRON] Error in checkDueSoonBorrowings job:', error);
  }
}

module.exports = checkDueSoonBorrowings;
