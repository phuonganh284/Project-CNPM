-- Migration: Add email verification and password reset columns to users table
-- Created: 2025-11-11
-- Description: Adds columns for email verification and password reset functionality

-- Add is_verified column (default FALSE for existing users)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Add verification_token column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);

-- Add verification_expires column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP;

-- Add reset_token column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);

-- Add reset_token_expires column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP;

-- Add created_at column (default to current timestamp for existing users)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing users to be verified (if any exist)
-- Uncomment the line below if you want existing users to be automatically verified
-- UPDATE users SET is_verified = TRUE WHERE is_verified IS NULL OR is_verified = FALSE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email, is_verified);

-- Display migration success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully: Email verification and password reset columns added to users table';
END $$;
