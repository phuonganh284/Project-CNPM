const cron = require('node-cron');
const { checkExpiredRequests } = require('./checkExpiredRequests');
const checkDueSoonBorrowings = require('./checkDueSoonBorrowings');
const { checkOverdueBorrowings } = require('./checkOverdueBorrowings');

function startScheduler() {
  console.log('[SCHEDULER] Starting background jobs...');
  
  // Job 1: Check expired pickup requests
  cron.schedule('1 * * * *', async () => {
    console.log('[SCHEDULER] Running: checkExpiredRequests (every hour at minute 1)');
    try {
      await checkExpiredRequests();
    } catch (error) {
      console.error('[SCHEDULER] Error in checkExpiredRequests:', error);
    }
  });
  
  // Job 2: Check borrowings due soon (3, 2, 1 days before) 
  cron.schedule('0 9 * * *', async () => {
    console.log('[SCHEDULER] Running: checkDueSoonBorrowings (daily at 9 AM)');
    try {
      await checkDueSoonBorrowings();
    } catch (error) {
      console.error('[SCHEDULER] Error in checkDueSoonBorrowings:', error);
    }
  });

  // Job 3: Check for and notify about overdue borrowings
  cron.schedule('0 10 * * *', async () => {
    console.log('[SCHEDULER] Running: checkOverdueBorrowings (daily at 10 AM)');
    try {
      await checkOverdueBorrowings();
    } catch (error) {
      console.error('[SCHEDULER] Error in checkOverdueBorrowings:', error);
    }
  });
  
  console.log('[SCHEDULER] ✓ All jobs scheduled:');
  console.log('  - checkExpiredRequests: Every hour at minute 1');
  console.log('  - checkDueSoonBorrowings: Daily at 9:00 AM');
  console.log('  - checkOverdueBorrowings: Daily at 10:00 AM');
}

function stopScheduler() {
  console.log('[SCHEDULER] Stopping all jobs...');
  cron.getTasks().forEach(task => task.stop());
  console.log('[SCHEDULER] All jobs stopped');
}

module.exports = {
  startScheduler,
  stopScheduler
};
