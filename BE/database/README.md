# Database Migrations

This directory contains SQL migration scripts for the Library Management System database.

## How to Apply Migrations

### Method 1: Using Node.js script (Recommended)

Make sure you have a `.env` file in the BE directory with your DATABASE_URL:

```bash
cd BE
node database/runMigration.js
```

### Method 2: Using psql (Command Line)

If your database is already set up, run the migration file:

```bash
psql -U your_username -d your_database_name -f migrations/001_add_verification_columns.sql
```

### Method 2: Using pgAdmin or Database GUI

1. Open your database in pgAdmin or your preferred PostgreSQL GUI
2. Open the migration file: `migrations/001_add_verification_columns.sql`
3. Execute the SQL script

### Method 3: From Node.js Application

You can also run migrations programmatically:

```javascript
const { pool } = require('../src/config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const migrationPath = path.join(__dirname, 'migrations/001_add_verification_columns.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  try {
    await pool.query(sql);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
```

## Verify Migration

After running the migration, verify it was successful:

```bash
psql -U your_username -d your_database_name -f verify_migration.sql
```

This will show you:
- The updated structure of the users table
- Indexes that were created
- Count of users by verification status

## Migration Files

### 001_add_verification_columns.sql

Adds the following columns to the `users` table:

- `is_verified` (BOOLEAN) - Whether the user's email has been verified
- `verification_token` (VARCHAR) - Token for email verification
- `verification_expires` (TIMESTAMP) - Expiration time for verification token
- `reset_token` (VARCHAR) - Token for password reset
- `reset_token_expires` (TIMESTAMP) - Expiration time for reset token
- `created_at` (TIMESTAMP) - When the user was created

Also creates indexes for better query performance.

### Rollback Script

If you need to undo the migration, the rollback script is located in:
`rollback/rollback_001.sql`

To rollback:
```bash
psql -U your_username -d your_database_name -f rollback/rollback_001.sql
```

## Starting Fresh

If you want to recreate the entire database from scratch:

```bash
# Drop the existing database (WARNING: This deletes all data!)
psql -U your_username -c "DROP DATABASE IF EXISTS your_database_name;"

# Create the database
psql -U your_username -c "CREATE DATABASE your_database_name;"

# Run the main schema
psql -U your_username -d your_database_name -f schema.sql
```

## Notes

- Always backup your database before running migrations
- The migration script uses `IF NOT EXISTS` clauses, so it's safe to run multiple times
- Existing users will have `is_verified = FALSE` by default
- You can uncomment the UPDATE statement in the migration to auto-verify existing users
