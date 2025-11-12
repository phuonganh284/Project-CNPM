-- Verification Script: Check users table structure
-- Run this to verify the migration was successful

-- Display the structure of the users table
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'users'
ORDER BY 
    ordinal_position;

-- Check if indexes were created
SELECT 
    indexname,
    indexdef
FROM 
    pg_indexes
WHERE 
    tablename = 'users'
    AND (
        indexname = 'idx_users_verification_token' 
        OR indexname = 'idx_users_reset_token'
        OR indexname = 'idx_users_email_verified'
    );

-- Count users by verification status
SELECT 
    is_verified,
    COUNT(*) as user_count
FROM 
    users
GROUP BY 
    is_verified;
