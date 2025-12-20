require('dotenv').config();

// BE/test-jobs.js

// This script allows you to manually trigger scheduled jobs for testing.
// Usage: node test-jobs.js <jobName>
//
// <jobName> can be one of:
// - expired: To run checkExpiredRequests
// - dueSoon: To run checkDueSoonBorrowings
// - overdue: To run checkOverdueBorrowings

// Import the job functions
const { checkExpiredRequests } = require('./src/jobs/checkExpiredRequests');
const checkDueSoonBorrowings = require('./src/jobs/checkDueSoonBorrowings');
const { checkOverdueBorrowings } = require('./src/jobs/checkOverdueBorrowings');

const jobName = process.argv[2]; // Get the job name from command line arguments

async function runJob() {
  if (!jobName) {
    console.error('Please provide a job name to run.');
    console.log('Usage: node test-jobs.js <jobName>');
    console.log('Available jobs: expired, dueSoon, overdue');
    return;
  }

  console.log(`[MANUAL RUN] Starting job: '${jobName}'...`);
  try {
    switch (jobName) {
      case 'expired':
        await checkExpiredRequests();
        break;
      case 'dueSoon':
        await checkDueSoonBorrowings();
        break;
      case 'overdue':
        await checkOverdueBorrowings();
        break;
      default:
        console.error(`Error: Job '${jobName}' not found.`);
        console.log('Available jobs: expired, dueSoon, overdue');
        break;
    }
    console.log(`[MANUAL RUN] Job '${jobName}' finished.`);
    // Force exit to prevent hanging connections, useful for scripting
    process.exit(0);
  } catch (error) {
    console.error(`[MANUAL RUN] An error occurred during job '${jobName}':`, error);
    process.exit(1);
  }
}

runJob();