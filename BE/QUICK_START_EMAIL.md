# 🚀 Quick Start - Email Verification

## Step 1: Configure Email (Required)

Edit `/BE/.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

### Get Gmail App Password:
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2FA if not already enabled
3. Generate password for "Mail" → "Other"
4. Copy 16-character password to .env

---

## Step 2: Test Email Configuration

```bash
cd /Users/albuscorleone/Documents/Project-CNPM/BE
node test-email.js
```

If successful, you'll receive a test email! ✅

---

## Step 3: Run Database Migration (if needed)

```bash
cd /Users/albuscorleone/Documents/Project-CNPM/BE/database
node runMigration.js
```

---

## Step 4: Start Backend Server

```bash
cd /Users/albuscorleone/Documents/Project-CNPM/BE
npm run dev
```

---

## 📡 Test API Endpoints

### 1. Register (sends verification email)
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "reader"
  }'
```

**Response:** 
```json
{
  "success": true,
  "message": "Đăng ký thành công! Vui lòng check email để xác nhận tài khoản.",
  "data": {
    "user": {
      "is_verified": false,
      ...
    }
  }
}
```

### 2. Check Email → Get Token or Code

### 3. Verify Email
```bash
curl -X POST http://localhost:5001/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-token-from-email"
  }'
```

Or with code:
```bash
curl -X POST http://localhost:5001/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'
```

### 4. Login (now requires verified email)
```bash
curl -X POST http://localhost:5001/api/auth/reader/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🔑 All New Endpoints

| Endpoint | Body | Description |
|----------|------|-------------|
| `POST /api/auth/verify-email` | `{token}` or `{code}` | Verify email |
| `POST /api/auth/resend-verification` | `{email}` | Resend email |
| `POST /api/auth/forgot-password` | `{email}` | Request reset |
| `POST /api/auth/reset-password` | `{token, new_password}` | Reset password |

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No email received | Check spam folder, verify EMAIL_USER/PASSWORD |
| "EAUTH" error | Use App Password, not regular password |
| "Token expired" | Request resend verification |
| "Email not verified" | Complete verification first |

---

## 📚 Full Documentation

- **Detailed Setup:** `/BE/EMAIL_VERIFICATION_SETUP.md`
- **Implementation Summary:** `/BE/EMAIL_VERIFICATION_IMPLEMENTATION_SUMMARY.md`
- **Backend Division Doc:** `/BE/BACKEND_3_PERSON_DIVISION.md`

---

## ✅ Done!

Your email verification system is ready to use! 🎉

**Key Features:**
- ✅ Email verification on registration
- ✅ Password reset via email
- ✅ Password change notifications
- ✅ Both token & code verification
- ✅ 15-minute token expiration
- ✅ Secure & production-ready

**Need help?** Check the full documentation or test-email.js for diagnostics.
