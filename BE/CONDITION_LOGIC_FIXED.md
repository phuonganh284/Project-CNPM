# ✅ ĐÃ SỬA LOGIC CONDITION - Return Workflow

## 🔧 Vấn đề phát hiện:

❌ **SAI**: Logic condition bị nhầm lẫn giữa reader self-assessment và librarian assessment

## ✅ Logic đúng đã implement:

### 1. **Create Return Request (Reader)**
```javascript
POST /api/borrowings/:id/return-request
Body: {
  returnedCondition: 80,  // Reader tự đánh giá (0-100)
  damageDetails: {        // Optional
    notes: "Minor scratches on cover",
    images: []
  }
}
```
**Lưu vào DB**: `returned_condition` (reader's self-assessment)

---

### 2. **Assess Return Condition (Librarian)**
```javascript
PUT /api/borrowings/return-requests/:id/assess
Body: {
  assessedCondition: "MINOR",  // Librarian đánh giá: OK/MINOR/MODERATE/SEVERE/LOST
  assessmentNotes: "Confirmed minor damage on cover"  // Optional
}
```

**System tự động tính:**
- `overdue_fee` = overdue_days × OVERDUE_RATE_PER_DAY × borrowed_copy_price / 100
- `damage_fee` dựa trên `assessed_condition`:
  - OK: 0%
  - MINOR: 5% of borrowed_copy_price
  - MODERATE: 15% of borrowed_copy_price
  - SEVERE: 30% of borrowed_copy_price
  - LOST: 100% of borrowed_copy_price
- `total_fee` = overdue_fee + damage_fee

**Lưu vào DB**: `assessed_condition`, `overdue_fee`, `damage_fee`, `total_fee`, `assessed_at`

---

### 3. **Complete Return**
```javascript
POST /api/borrowings/return-requests/:id/complete
```

**System tự động:**
- Tính new copy condition:
  - Lấy `current_condition` (từ book_copies lúc query)
  - Trừ đi damage%:
    - OK: 0%
    - MINOR: -5%
    - MODERATE: -15%
    - SEVERE: -30%
    - LOST: -100% (= 0)
- Update book_copies:
  - `condition` = new calculated condition
  - `copy_price` = book_price × new_condition / 100
  - `availability` = FALSE if LOST, TRUE otherwise
- Update borrowing_records: `status` = 'returned'
- Update return_requests: `status` = 'completed'
- Decrease reader borrow_count

---

## 📊 Database Schema Required:

### return_requests table needs:
```sql
- return_id (PK)
- borrow_id (FK)
- reader_id (FK)
- returned_condition INT (0-100)  -- Reader self-assessment
- assessed_condition VARCHAR      -- OK/MINOR/MODERATE/SEVERE/LOST
- overdue_fee NUMERIC
- damage_fee NUMERIC
- total_fee NUMERIC
- damage_details JSONB            -- Reader's notes/images
- assessment_notes TEXT           -- Librarian's notes
- request_date TIMESTAMP
- assessed_at TIMESTAMP
- completed_at TIMESTAMP
- status VARCHAR                  -- pending/assessed/completed
```

---

## 🎯 Files đã sửa:

1. ✅ `BE/src/controllers/borrowing.controller.js`
   - createReturnRequest: Nhận `returnedCondition` từ reader
   - assessReturnCondition: Chỉ nhận `assessedCondition` + `assessmentNotes`

2. ✅ `BE/src/models/borrowing.model.js`
   - createReturnRequest: Lưu `returned_condition` và `damage_details`
   - assessReturnCondition: Tính overdue_fee và damage_fee tự động
   - completeReturn: Update copy condition dựa trên `assessed_condition`

---

## 🔑 Key Points:

1. **Reader không thể tự tính fee** - Chỉ đánh giá condition
2. **Librarian không cần gửi returned_condition** - Đã có sẵn từ reader
3. **System tự tính tất cả fees** dựa trên:
   - Overdue days
   - Librarian's assessment severity
   - Borrowed copy price (snapshot)
4. **Copy condition giảm dựa trên damage level**, KHÔNG phải reader's assessment
5. **LOST books** → availability = FALSE, condition = 0

---

## ⚠️ Migration cần chạy:

File: `BE/database/migrations/001_enhance_return_requests.sql`

Thêm columns:
- returned_condition
- assessed_condition  
- assessment_notes
- damage_details (JSONB)
- overdue_fee, damage_fee, total_fee
- assessed_at, completed_at

Update status enum: 'pending' | 'assessed' | 'completed'
