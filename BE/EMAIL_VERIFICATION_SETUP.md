# Email Verification Setup Guide

## ✅ Completed Tasks

The email verification system has been successfully implemented following the BACKEND_3_PERSON_DIVISION.md instructions.

### What was added:

1. **Utility Files:**
   - `BE/src/utils/tokenGenerator.js` - Generates verification tokens and codes
   - `BE/src/utils/emailService.js` - Handles all email sending (verification, password reset, notifications)

2. **New API Endpoints:**
   - `POST /api/auth/verify-email` - Verify email with token or code
   - `POST /api/auth/resend-verification` - Resend verification email
   - `POST /api/auth/forgot-password` - Request password reset
   - `POST /api/auth/reset-password` - Reset password with token

3. **Updated Endpoints:**
   - `POST /api/auth/register` - Now sends verification email
   - `POST /api/auth/reader/login` - Checks if email is verified
   - `POST /api/auth/librarian/login` - Checks if email is verified
   - `PUT /api/auth/change-password` - Sends notification email

4. **Dependencies:**
   - ✅ `nodemailer` installed

---

## 🔧 Environment Variables Setup

You need to add the following variables to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173

# Existing variables
JWT_SECRET=your-jwt-secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_db
DB_USER=postgres
DB_PASSWORD=your-db-password
PORT=5000
```

---

## 📧 Gmail App Password Setup

To use Gmail for sending emails, you need to generate an **App Password**:

### Steps:

1. **Enable 2-Factor Authentication** on your Google Account:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter name: "Library Management System"
   - Click "Generate"
   - Copy the 16-character password

3. **Add to .env file**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # The 16-character app password
   ```

---

## 📊 Database Migration

The database schema already includes the required columns. To verify, run:

```bash
cd /Users/albuscorleone/Documents/Project-CNPM/BE/database
node runMigration.js
```

This will add the following columns to the `users` table:
- `is_verified` (BOOLEAN, default: false)
- `verification_token` (VARCHAR(255))
- `verification_expires` (TIMESTAMP)
- `reset_token` (VARCHAR(255))
- `reset_token_expires` (TIMESTAMP)

---

## 🧪 Testing the Email Verification Flow

### 1. Register a new user:
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "test_user",
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User",
  "role": "reader"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công! Vui lòng check email để xác nhận tài khoản.",
  "data": {
    "user": {
      "id": 1,
      "username": "test_user",
      "email": "test@example.com",
      "name": "Test User",
      "role": "reader",
      "status": "active",
      "is_verified": false
    }
  }
}
```

### 2. Check your email for verification link/code

### 3. Verify email:
```bash
POST http://localhost:5000/api/auth/verify-email
Content-Type: application/json

{
  "token": "your-token-from-email"
}
# OR
{
  "code": "123456"
}
```

### 4. Login (now requires verified email):
```bash
POST http://localhost:5000/api/auth/reader/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 5. Resend verification (if needed):
```bash
POST http://localhost:5000/api/auth/resend-verification
Content-Type: application/json

{
  "email": "test@example.com"
}
```

---

## 🔑 Forgot Password Flow

### 1. Request password reset:
```bash
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### 2. Check email for reset link/code

### 3. Reset password:
```bash
POST http://localhost:5000/api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "new_password": "newpassword123"
}
# OR
{
  "code": "654321",
  "new_password": "newpassword123"
}
```

---

## 🔄 Change Password (when logged in)

```bash
PUT http://localhost:5000/api/auth/change-password
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "old_password": "password123",
  "new_password": "newpassword456"
}
```

A notification email will be sent after successful password change.

---

## 📝 Email Templates

The system sends three types of emails:

1. **Verification Email** - Sent after registration
   - Contains verification link and 6-digit code
   - Valid for 15 minutes

2. **Password Reset Email** - Sent when user forgets password
   - Contains reset link and 6-digit code
   - Valid for 15 minutes

3. **Password Changed Notification** - Sent after password change
   - Alerts user of password change
   - Includes timestamp

---

## 🚨 Error Handling

### Common errors and solutions:

| Error | Solution |
|-------|----------|
| "Vui lòng xác nhận email trước khi đăng nhập" | User must verify email first |
| "Token đã hết hạn" | Request new verification/reset email |
| "Token không hợp lệ" | Check if token is correct |
| "Email đã được xác nhận" | User already verified, can login |
| "Không thể gửi email" | Check EMAIL_USER and EMAIL_PASSWORD in .env |

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Email verification required before login
- ✅ Token expiration (15 minutes)
- ✅ Secure token generation (32-byte hex)
- ✅ 6-digit verification code option
- ✅ Password reset with email confirmation
- ✅ Change password notification
- ✅ Doesn't reveal if email exists (forgot password)

---

## 🎯 Next Steps

1. **Update .env file** with email credentials
2. **Run database migration** to ensure columns exist
3. **Test registration flow** with a real email
4. **Configure frontend** to handle verification pages
5. **Update existing users** (optional):
   ```sql
   -- Set existing users to verified
   UPDATE users SET is_verified = TRUE WHERE is_verified = FALSE;
   ```

---

## 📚 API Endpoints Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/verify-email` | POST | No | Verify email with token/code |
| `/api/auth/resend-verification` | POST | No | Resend verification email |
| `/api/auth/reader/login` | POST | No | Reader login (requires verified email) |
| `/api/auth/librarian/login` | POST | No | Librarian login (requires verified email) |
| `/api/auth/forgot-password` | POST | No | Request password reset |
| `/api/auth/reset-password` | POST | No | Reset password with token |
| `/api/auth/change-password` | PUT | Yes | Change password (sends notification) |
| `/api/auth/profile` | GET | Yes | Get user profile |

---

## 💡 Tips

- Use a **test email account** for development
- Consider using **Mailtrap** or **Ethereal** for testing without real emails
- In production, use a proper email service like **SendGrid**, **AWS SES**, or **Mailgun**
- Monitor email delivery rates and handle bounces

---

## 🐛 Troubleshooting

If emails are not being sent:

1. Check console for errors
2. Verify EMAIL_USER and EMAIL_PASSWORD in .env
3. Make sure 2FA is enabled on Gmail
4. Regenerate App Password if needed
5. Check spam folder for emails
6. Try with a different email service

---

**Implemented by: Following BACKEND_3_PERSON_DIVISION.md - Người 1: Authentication & Discovery**
