# ✅ ĐÃ SỬA XONG - Model & Schema Alignment

## 🔧 Những gì đã sửa:

### 1. **Sửa tên bảng trong test file**
- ❌ `books` → ✅ `book_titles`
- ❌ `copies` (với `availability_status`) → ✅ `book_copies` (với `availability` boolean)

### 2. **Sửa tên cột trong Models**
- ❌ `return_request_id` → ✅ `return_id` (match với schema)
- Files sửa:
  - ✅ `BE/src/models/borrowing.model.js`
  - ✅ `BE/src/models/notification.model.js`
  - ✅ `BE/tests/borrow-return.test.js`

### 3. **Sửa server.js để test-friendly**
- ✅ Không start server khi `NODE_ENV=test`
- ✅ Export app cho testing
- ✅ Pool cleanup trong test teardown

### 4. **Thêm test script**
- ✅ `npm test` với `NODE_ENV=test` và `--forceExit`

## ⚠️ PHẢI LÀM TRƯỚC KHI TEST:

Chạy 3 SQL files này trên **Supabase SQL Editor**:

### 1️⃣ Migration (BẮT BUỘC!)
```
BE/database/migrations/001_enhance_return_requests.sql
```
**Mục đích:** Thêm các cột cần thiết vào bảng `return_requests`:
- `returned_condition`, `assessed_condition`
- `overdue_fee`, `damage_fee`, `total_fee`
- `damage_details` (JSONB)
- `assessment_notes`, `assessed_at`, `completed_at`
- Update status enum: 'pending' | 'assessed' | 'completed'

### 2️⃣ Seed Users
```
BE/database/seed_test_users.sql
```
**Tạo:**
- 3 readers (reader1@hcmut.edu.vn, reader2@hcmut.edu.vn, reader3@hcmut.edu.vn)
- 1 librarian (librarian@hcmut.edu.vn)
- Password tất cả: `123456`

### 3️⃣ Seed Books & Copies
```
BE/database/seed_test_books.sql
```
**Tạo:**
- 5 books (Algorithm, Database, OS, etc.)
- 10 copies với condition 70-95%

## 🚀 Chạy Test:

```powershell
cd BE
npm test
```

## 📊 Kết quả mong đợi:

```
Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
```

## 📝 Test Cases (25 total):

- ✅ TC001-003: Create borrow request (happy path, 5-item limit, invalid date)
- ✅ TC002: Approve request (success, not found, copy unavailable)
- ✅ TC003: Confirm delivery
- ✅ TC004: Renew borrowing (success, already renewed, > 14 days)
- ✅ TC005: Create return request (success, duplicate, invalid condition)
- ✅ TC006: Assess return condition (success, not found, invalid)
- ✅ TC007: Complete return (success, not assessed)
- ✅ TC008-012: Query endpoints (my requests, pending, reject, cancel, dashboard)

## 🗄️ Database Tables (Schema đã đúng):

```
✅ users
✅ readers
✅ librarians  
✅ categories
✅ book_titles (NOT books)
✅ book_copies (NOT copies)
✅ borrow_requests
✅ borrowing_records
✅ return_requests (cần chạy migration!)
✅ receipts
✅ notification_types
✅ notifications
```

## ✨ Model đã sửa đúng tên:

- ✅ `FROM book_titles` (not books)
- ✅ `FROM book_copies` (not copies)
- ✅ `rr.return_id` (not return_request_id)
- ✅ `bc.availability` (boolean, not availability_status)

---

**TÓM LẠI:** Tất cả code đã fix đúng schema. Bây giờ chỉ cần:
1. Chạy 3 SQL files trên Supabase
2. Chạy `npm test`
3. Done! ✅
