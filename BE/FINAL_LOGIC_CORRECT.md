# ✅ LOGIC CUỐI CÙNG - Return Workflow (ĐÚNG)

## 📖 Ví dụ thực tế:

### Người 1 mượn copy mới:
1. **Lúc mượn (confirmDelivery)**:
   - Copy condition: 100%, price: 100K
   - **Snapshot lưu vào borrowing_records**:
     - `borrowed_condition` = 100%
     - `borrowed_copy_price` = 100K

2. **Lúc trả (createReturnRequest)**:
   - Reader tự đánh giá: `returned_condition` = 80%

3. **Librarian assess**:
   - Librarian xem sách thực tế, chọn: `assessed_condition` = MODERATE (20% damage)
   - **System tính fee**:
     - `damage_fee` = `borrowed_copy_price` × 20% = 100K × 20% = **20K**
     - `overdue_fee` = (nếu có)
     - `total_fee` = 20K + overdue_fee

4. **Complete return**:
   - **New condition** = `borrowed_condition` - 20% = 100% - 20% = **80%**
   - **New price** = book_price × 80% = 100K × 80% = **80K**
   - Copy availability = TRUE

---

### Người 2 mượn copy đã hỏng:
1. **Lúc mượn (confirmDelivery)**:
   - Copy condition: 80%, price: 80K (do người 1 làm hỏng)
   - **Snapshot lưu vào borrowing_records**:
     - `borrowed_condition` = 80%
     - `borrowed_copy_price` = 80K

2. **Lúc trả (createReturnRequest)**:
   - Reader tự đánh giá: `returned_condition` = 70%

3. **Librarian assess**:
   - Librarian xem sách thực tế, chọn: `assessed_condition` = MINOR (10% damage thêm)
   - **System tính fee**:
     - `damage_fee` = `borrowed_copy_price` × 10% = 80K × 10% = **8K**
     - `total_fee` = 8K + overdue_fee

4. **Complete return**:
   - **New condition** = `borrowed_condition` - 10% = 80% - 10% = **70%**
   - **New price** = book_price × 70% = 100K × 70% = **70K**
   - Copy availability = TRUE

---

### Nếu không làm hỏng gì:
1. **Lúc mượn**: borrowed_condition = 80%, borrowed_copy_price = 80K
2. **Lúc trả**: returned_condition = 80% (không hỏng)
3. **Librarian assess**: assessed_condition = OK
4. **System tính**:
   - damage_fee = 80K × 0% = **0K**
5. **Complete return**:
   - New condition = 80% - 0% = **80%** (giữ nguyên)
   - New price = 80K (giữ nguyên)

---

## 🔑 Công thức chính:

### Fee Calculation (trong assessReturnCondition):
```javascript
damage_fee = borrowed_copy_price × damage_percent
```

**Damage rates:**
- OK: 0%
- MINOR: 5%
- MODERATE: 15%
- SEVERE: 30%
- LOST: 100%

### Condition Update (trong completeReturn):
```javascript
new_condition = borrowed_condition - damage_percent
```

**Condition impact:**
- OK: -0%
- MINOR: -5%
- MODERATE: -15%
- SEVERE: -30%
- LOST: -100% (= 0%)

---

## 📊 Database Schema:

### borrowing_records:
```sql
borrowed_copy_price NUMERIC(10,2)  -- Snapshot price khi mượn
borrowed_condition INT             -- Snapshot condition khi mượn (NEW!)
```

### return_requests:
```sql
returned_condition INT             -- Reader's self-assessment
assessed_condition VARCHAR(20)     -- Librarian's assessment (OK/MINOR/...)
damage_fee NUMERIC(10,2)          -- Calculated by system
```

---

## ✅ Files đã sửa:

1. **`001_enhance_return_requests.sql`**
   - Add `borrowed_condition` to borrowing_records
   - Update trigger to snapshot both price AND condition

2. **`borrowing.model.js`**
   - assessReturnCondition: Tính damage_fee = borrowed_copy_price × %
   - completeReturn: new_condition = borrowed_condition - %
   - getReturnRequestById, getAllReturnRequests: Lấy borrowed_condition

---

## 🎯 Key Points:

✅ Fee dựa trên **giá lúc mượn** (borrowed_copy_price)
✅ Condition mới dựa trên **condition lúc mượn** (borrowed_condition)
✅ Reader chỉ tự đánh giá, **không ảnh hưởng fee**
✅ Librarian assessment quyết định % damage
✅ Người sau không chịu trách nhiệm cho damage của người trước
