# Database Schema Changes Summary

## What Was Added

The following columns were added to the **users** table to support email verification and password reset functionality:

### New Columns

| Column Name | Data Type | Default | Description |
|------------|-----------|---------|-------------|
| `is_verified` | BOOLEAN | FALSE | Indicates if user's email has been verified |
| `verification_token` | VARCHAR(255) | NULL | Token sent via email for account verification |
| `verification_expires` | TIMESTAMP | NULL | Expiration timestamp for verification token (15 min) |
| `reset_token` | VARCHAR(255) | NULL | Token sent via email for password reset |
| `reset_token_expires` | TIMESTAMP | NULL | Expiration timestamp for reset token (15 min) |
| `created_at` | TIMESTAMP | CURRENT_TIMESTAMP | When the user account was created |

### New Indexes

For better query performance:

- `idx_users_verification_token` - Index on verification_token
- `idx_users_reset_token` - Index on reset_token  
- `idx_users_email_verified` - Composite index on (email, is_verified)

## How to Apply

### Option 1: Run the Migration Script (Recommended)

```bash
cd BE/database
node runMigration.js
```

### Option 2: Direct SQL Execution

```bash
cd BE/database
psql -U your_username -d your_database_name -f migrations/001_add_verification_columns.sql
```

### Option 3: Using Database GUI

Open `migrations/001_add_verification_columns.sql` in pgAdmin or your preferred tool and execute it.

## Authentication Flow Impact

### Before Migration
1. User registers → Immediately active
2. User can login right away

### After Migration
1. User registers → `is_verified = FALSE`
2. Email sent with verification token
3. User clicks link/enters code
4. `is_verified` set to TRUE
5. User can now login

## API Endpoints Affected

These new endpoints require the database changes:

- `POST /api/auth/register` - Now creates unverified users
- `POST /api/auth/verify-email` - Verifies email with token
- `POST /api/auth/resend-verification` - Resends verification email
- `POST /api/auth/login` - Checks `is_verified` before allowing login
- `POST /api/auth/forgot-password` - Generates reset_token
- `POST /api/auth/reset-password` - Uses reset_token to change password

## Testing the Changes

After applying migration:

```sql
-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';

-- Check if columns exist
SELECT 
    is_verified,
    verification_token,
    verification_expires,
    reset_token,
    reset_token_expires,
    created_at
FROM users
LIMIT 1;
```

## Rollback (If Needed)

If you need to remove these columns:

```sql
ALTER TABLE users DROP COLUMN IF EXISTS is_verified;
ALTER TABLE users DROP COLUMN IF EXISTS verification_token;
ALTER TABLE users DROP COLUMN IF EXISTS verification_expires;
ALTER TABLE users DROP COLUMN IF EXISTS reset_token;
ALTER TABLE users DROP COLUMN IF EXISTS reset_token_expires;
ALTER TABLE users DROP COLUMN IF EXISTS created_at;

DROP INDEX IF EXISTS idx_users_verification_token;
DROP INDEX IF EXISTS idx_users_reset_token;
DROP INDEX IF EXISTS idx_users_email_verified;
```

## Notes

- ✅ Migration is safe to run on existing databases
- ✅ Uses `IF NOT EXISTS` to prevent errors if already applied
- ✅ Existing users will have `is_verified = FALSE`
- ⚠️ You may want to manually set existing users to verified
- ⚠️ Always backup your database before migrations
