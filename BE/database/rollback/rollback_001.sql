-- Rollback Migration: Remove email verification and password reset columns
-- Created: 2025-11-11
-- WARNING: This will remove verification and reset functionality
-- Only run this if you need to rollback the migration

-- Remove indexes first
DROP INDEX IF EXISTS idx_users_verification_token;
DROP INDEX IF EXISTS idx_users_reset_token;
DROP INDEX IF EXISTS idx_users_email_verified;

-- Remove columns
ALTER TABLE users DROP COLUMN IF EXISTS is_verified;
ALTER TABLE users DROP COLUMN IF EXISTS verification_token;
ALTER TABLE users DROP COLUMN IF EXISTS verification_expires;
ALTER TABLE users DROP COLUMN IF EXISTS reset_token;
ALTER TABLE users DROP COLUMN IF EXISTS reset_token_expires;
ALTER TABLE users DROP COLUMN IF EXISTS created_at;

-- Display rollback success message
DO $$
BEGIN
    RAISE NOTICE 'Rollback completed: Verification and reset columns removed from users table';
END $$;
