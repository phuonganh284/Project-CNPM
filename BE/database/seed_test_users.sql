-- ========================================
-- SEED DATA FOR TESTING
-- Library Management System
-- ========================================

-- Clean up existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM notifications WHERE user_id IN (1,2,3,4);
-- DELETE FROM return_requests WHERE borrow_id IN (SELECT borrow_id FROM borrowing_records WHERE reader_id IN (1,2,3));
-- DELETE FROM borrowing_records WHERE reader_id IN (1,2,3);
-- DELETE FROM borrow_requests WHERE reader_id IN (1,2,3);
-- DELETE FROM readers WHERE reader_id IN (1,2,3);
-- DELETE FROM librarians WHERE librarian_id = 1;
-- DELETE FROM users WHERE user_id IN (1,2,3,4);

-- ========================================
-- 1. INSERT USERS
-- ========================================
-- Password for all users: "123456"
-- Hashed with bcrypt (10 rounds): $2a$10$CwTycUXWue0Thq9StjUM0uJ8qFQxZ.eJ4a3r3WzJkN7LkO3lZzGGy

INSERT INTO users (user_id, username, email, password, name, status, created_at) VALUES
-- Reader 1
(1, 'reader1', 'reader1@hcmut.edu.vn', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8qFQxZ.eJ4a3r3WzJkN7LkO3lZzGGy', 'Nguyen Van A', 'active', NOW()),

-- Reader 2
(2, 'reader2', 'reader2@hcmut.edu.vn', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8qFQxZ.eJ4a3r3WzJkN7LkO3lZzGGy', 'Tran Thi B', 'active', NOW()),

-- Reader 3
(3, 'reader3', 'reader3@hcmut.edu.vn', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8qFQxZ.eJ4a3r3WzJkN7LkO3lZzGGy', 'Le Van C', 'active', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- ========================================
-- 2. INSERT READERS
-- ========================================

INSERT INTO readers (reader_id, user_id) VALUES
(1, 1),
(2, 2),
(3, 3)
ON CONFLICT (reader_id) DO NOTHING;

-- ========================================
-- 3. LIBRARIAN
-- ========================================
-- Skipped - Librarian already exists in database

-- ========================================
-- 4. INSERT NOTIFICATION TYPES (Required for notifications to work)
-- ========================================

INSERT INTO notification_types (type_name, recipient_role) VALUES
-- Reader notifications
('REQUEST_APPROVED', 'reader'),
('REQUEST_REJECTED', 'reader'),
('REQUEST_EXPIRED', 'reader'),
('BORROW_DUE_SOON', 'reader'),
('BORROW_OVERDUE', 'reader'),
('PENALTY_ISSUED', 'reader'),

-- Librarian notifications
('NEW_BORROW_REQUEST', 'librarian'),
('NEW_RETURN_REQUEST', 'librarian')
ON CONFLICT (type_name) DO NOTHING;

-- ========================================
-- 5. VERIFY INSERTED DATA
-- ========================================

-- Check users
SELECT 'Users created:' as info;
SELECT user_id, email, name, status FROM users WHERE user_id IN (1,2,3);

-- Check readers
SELECT 'Readers created:' as info;
SELECT r.reader_id, u.name, u.email 
FROM readers r 
JOIN users u ON r.user_id = u.user_id;

-- Check notification types
SELECT 'Notification types created:' as info;
SELECT type_id, type_name, recipient_role FROM notification_types ORDER BY type_id;

-- ========================================
-- SEED DATA SUMMARY
-- ========================================
/*
CREATED TEST ACCOUNTS:

📚 READERS (Password: 123456):
1. reader1@hcmut.edu.vn - Nguyen Van A
2. reader2@hcmut.edu.vn - Tran Thi B
3. reader3@hcmut.edu.vn - Le Van C

To use in mock auth, set:
- Reader: user_id = 1, reader_id = 1
*/
