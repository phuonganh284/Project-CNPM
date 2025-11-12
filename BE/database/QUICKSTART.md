# Quick Start: Apply Database Changes

## 🎯 What You Need to Do

Your database needs to be updated to support email verification and password reset features.

## ⚡ Quick Steps

### 1. Make sure your .env file exists

```bash
cd BE
# If .env doesn't exist, copy from example:
cp .env.example .env
# Then edit .env and add your DATABASE_URL
```

### 2. Make sure your database is running

Check your PostgreSQL database is running and accessible.

### 2. Run the migration

**Option A: Using the Node.js script (Easiest)**

```bash
cd BE
node database/runMigration.js
```

**Option B: Using psql directly**

```bash
cd BE/database
psql -U your_username -d your_database_name -f migrations/001_add_verification_columns.sql
```

### 3. Verify it worked

```bash
cd BE/database
psql -U your_username -d your_database_name -f verify_migration.sql
```

You should see 6 new columns listed:
- ✅ is_verified
- ✅ verification_token
- ✅ verification_expires
- ✅ reset_token
- ✅ reset_token_expires
- ✅ created_at

## 📝 What Changed?

The `users` table now has additional columns for:
- ✉️ Email verification (when users register)
- 🔒 Password reset functionality
- 📅 User creation timestamp

## 🚀 Next Steps

After the database is updated:

1. ✅ Database is ready ← YOU ARE HERE
2. 📧 Set up email service (nodemailer)
3. 💻 Implement authentication endpoints
4. 🧪 Test the registration flow

## ⚠️ Important Notes

- This migration is **safe** to run on existing databases
- Existing users will have `is_verified = FALSE` by default
- You may want to manually verify existing users:
  ```sql
  UPDATE users SET is_verified = TRUE WHERE created_at < NOW();
  ```

## 🆘 Need Help?

- Check `MIGRATION_GUIDE.md` for detailed information
- Check `README.md` for more options
- If something goes wrong, run `rollback_001.sql`

## ✅ Success Indicators

After running the migration, you should see:
```
✅ Database connection successful
✅ Migration completed: 001_add_verification_columns.sql
✅ All columns added successfully
```

That's it! Your database is now ready for the authentication features. 🎉
