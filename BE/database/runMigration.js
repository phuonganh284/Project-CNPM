#!/usr/bin/env node

/**
 * Database Migration Runner
 * Run this script to apply database migrations
 * 
 * Usage: node runMigration.js
 */

const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { Pool } = require('pg');

// Create pool directly to handle errors better
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function runMigration(filename) {
  const migrationPath = path.join(MIGRATIONS_DIR, filename);
  
  console.log(`\n📝 Running migration: ${filename}`);
  
  try {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await pool.query(sql);
    console.log(`✅ Migration completed: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Migration failed: ${filename}`);
    console.error(`Error: ${error.message}`);
    return false;
  }
}

async function verifyMigration() {
  console.log('\n🔍 Verifying migration...');
  
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN (
        'is_verified', 
        'verification_token', 
        'verification_expires',
        'reset_token',
        'reset_token_expires',
        'created_at'
      )
      ORDER BY column_name;
    `);
    
    if (result.rows.length >= 6) {
      console.log('✅ All columns added successfully:');
      result.rows.forEach(row => {
        console.log(`   - ${row.column_name} (${row.data_type})`);
      });
    } else {
      console.log('⚠️  Warning: Not all columns were added');
      console.log(`   Expected 6 columns, found ${result.rows.length}`);
    }
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting database migration...\n');
  
  // Check for .env file
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found!');
    console.error('\n📝 Please create a .env file in the BE directory.');
    console.error('   You can copy .env.example and fill in your database credentials:\n');
    console.error('   cp .env.example .env\n');
    process.exit(1);
  }
  
  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL not set in .env file!');
    console.error('\n📝 Please add your database connection string to .env file:');
    console.error('   DATABASE_URL=postgresql://user:password@host:port/database\n');
    process.exit(1);
  }
  
  console.log('Database:', process.env.DB_NAME || 'from DATABASE_URL');
  
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');
    
    // Get all migration files
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    if (files.length === 0) {
      console.log('⚠️  No migration files found');
      return;
    }
    
    console.log(`Found ${files.length} migration file(s):\n`);
    
    // Run each migration
    for (const file of files) {
      const success = await runMigration(file);
      if (!success) {
        console.log('\n❌ Migration process stopped due to error');
        process.exit(1);
      }
    }
    
    // Verify migration
    await verifyMigration();
    
    console.log('\n✨ All migrations completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Migration process failed:');
    console.error('Error:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
main();
