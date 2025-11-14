const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runDebugQuery() {
  console.log(`\n⏳ Running debug query for return_id = 5...`);
  try {
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
        u.username,
        u.name as reader_name,
        u.email as reader_email
      FROM return_requests rr
      JOIN borrowing_records br ON rr.borrow_id = br.borrow_id
      JOIN book_copies bc ON br.copy_id = bc.copy_id
      JOIN book_titles bt ON bc.book_id = bt.book_id
      JOIN readers r ON br.reader_id = r.reader_id
      JOIN users u ON r.user_id = u.user_id
      WHERE rr.return_id = 5;
    `;
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      console.log('✅ Query completed successfully. Raw data for return_id = 5:');
      console.log(result.rows[0]);
    } else {
      console.log('⚠️ No data found for return_id = 5.');
    }
  } catch (error) {
    console.error(`❌ Debug query failed:`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

async function main() {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    await runDebugQuery();
  } catch (error) {
    console.error('❌ Debug process failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();