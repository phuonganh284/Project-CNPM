-- ========================================
-- SEED TEST DATA: Books & Copies
-- For Testing Borrow/Return Workflow
-- ========================================

-- 1. Insert test category
INSERT INTO categories (category_id, category_name, amount) VALUES
(1, 'Computer Science', 5),
(2, 'Mathematics', 3),
(3, 'Physics', 2)
ON CONFLICT (category_id) DO NOTHING;

-- 2. Insert test books
INSERT INTO book_titles (book_id, isbn, title, author, language, publisher, publish_year, description, price, total_stock, availability_status, available_stock, category_id) VALUES
(1, '978-0-13-468599-1', 'Introduction to Algorithms', 'Thomas H. Cormen', 'English', 'MIT Press', 2009, 'Comprehensive introduction to algorithms', 100.00, 3, 'available', 3, 1),
(2, '978-0-07-338314-9', 'Database System Concepts', 'Abraham Silberschatz', 'English', 'McGraw-Hill', 2019, 'Comprehensive database concepts', 85.00, 2, 'available', 2, 1),
(3, '978-0-13-595705-9', 'Operating System Concepts', 'Abraham Silberschatz', 'English', 'Wiley', 2018, 'Operating systems fundamentals', 95.00, 2, 'available', 2, 1),
(4, '978-0-321-57351-3', 'Algorithms', 'Robert Sedgewick', 'English', 'Addison-Wesley', 2011, 'Algorithms in Java', 90.00, 2, 'available', 2, 1),
(5, '978-1-449-35573-9', 'Learning SQL', 'Alan Beaulieu', 'English', 'O Reilly', 2020, 'Master SQL fundamentals', 50.00, 1, 'available', 1, 1)
ON CONFLICT (book_id) DO NOTHING;

-- 3. Insert test book copies
INSERT INTO book_copies (copy_id, book_id, condition, status, copy_price, availability) VALUES
-- Book 1: Introduction to Algorithms (3 copies)
(1, 1, 95, 'normal', 95.00, TRUE),
(2, 1, 85, 'normal', 85.00, TRUE),
(3, 1, 75, 'normal', 75.00, TRUE),

-- Book 2: Database System Concepts (2 copies)
(4, 2, 90, 'normal', 76.50, TRUE),
(5, 2, 80, 'normal', 68.00, TRUE),

-- Book 3: Operating System Concepts (2 copies)
(6, 3, 88, 'normal', 83.60, TRUE),
(7, 3, 92, 'normal', 87.40, TRUE),

-- Book 4: Algorithms (2 copies)
(8, 4, 85, 'normal', 76.50, TRUE),
(9, 4, 70, 'normal', 63.00, TRUE),

-- Book 5: Learning SQL (1 copy)
(10, 5, 95, 'normal', 47.50, TRUE)
ON CONFLICT (copy_id) DO NOTHING;

-- 4. Update sequences to continue from max ID
SELECT setval('categories_category_id_seq', (SELECT MAX(category_id) FROM categories));
SELECT setval('book_titles_book_id_seq', (SELECT MAX(book_id) FROM book_titles));
SELECT setval('book_copies_copy_id_seq', (SELECT MAX(copy_id) FROM book_copies));

-- 5. Verify inserted data
SELECT 'Test data seeded successfully!' as status;

SELECT 'Categories:' as info;
SELECT category_id, category_name, amount FROM categories;

SELECT 'Books:' as info;
SELECT book_id, isbn, title, author, price, total_stock, available_stock FROM book_titles;

SELECT 'Book Copies:' as info;
SELECT copy_id, book_id, condition, copy_price, availability FROM book_copies ORDER BY book_id, copy_id;
