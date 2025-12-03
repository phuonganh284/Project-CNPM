// This is a helper script to manually trigger scheduled jobs for testing.
require('dotenv').config();
const { checkExpiredRequests } = require('./src/jobs/checkExpiredRequests');
const checkDueSoonBorrowings = require('./src/jobs/checkDueSoonBorrowings');
const { checkOverdueBorrowings } = require('./src/jobs/checkOverdueBorrowings');

const run = async () => {
    const arg = process.argv[2];

    if (!arg) {
        console.log('Please specify which job to run:');
        console.log('  - To test expired approved requests: node test-jobs.js expire');
        console.log('  - To test due soon borrowings:     node test-jobs.js due-soon');
        console.log('  - To test overdue borrowings:      node test-jobs.js overdue');
        return;
    }

    if (arg === 'expire') {
        console.log('Manually running the job to check for expired requests...');
        await checkExpiredRequests();
        console.log('Expired request check finished.');
    } else if (arg === 'due-soon') {
        console.log('Manually running the job to check for borrowings that are due soon...');
        await checkDueSoonBorrowings();
        console.log('Due soon check finished.');
    } else if (arg === 'overdue') {
        console.log('Manually running the job to check for overdue borrowings...');
        await checkOverdueBorrowings();
        console.log('Overdue borrowings check finished.');
    } else {
        console.log(`Unknown job: ${arg}`);
    }
    process.exit(0);
};

run();
