const { Pool, types } = require('pg');

// OID for TIMESTAMP WITHOUT TIME ZONE is 1114
// This tells node-postgres to parse TIMESTAMP columns as UTC
types.setTypeParser(1114, (stringValue) => {
  return new Date(stringValue + 'Z');
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = { pool };
