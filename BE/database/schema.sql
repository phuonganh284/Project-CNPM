-- ===============================================
-- ENTITES AND RELATIONSHIPS
-- ===============================================
-- USER -------------------------------------------------------------------------------------
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, -- PK
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'banned', 'borrowing', 'overdue')) DEFAULT 'active',
    profile_picture TEXT,
);

-- Reader
CREATE TABLE readers (
    reader_id SERIAL PRIMARY KEY, -- PK
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE -- FK
);

-- Librarian
CREATE TABLE librarians (
    librarian_id SERIAL PRIMARY KEY, -- PK
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE -- FK
);


-- BOOK -------------------------------------------------------------------------------------
-- Category
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY, -- PK
    category_name VARCHAR(100) UNIQUE NOT NULL,
    amount INT DEFAULT 0 CHECK (amount >= 0)
);

-- Book Title
CREATE TABLE book_titles (
    book_id SERIAL PRIMARY KEY, -- PK
    isbn VARCHAR(20) UNIQUE,
    cover TEXT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    language VARCHAR(100),
    publisher VARCHAR(255),
    publish_year INT CHECK (publish_year >= 0),
    description TEXT,
    price NUMERIC(10,2) CHECK (price >= 0),
    total_stock INT DEFAULT 0 CHECK (total_stock >= 0),
    availability_status VARCHAR(20) CHECK (availability_status IN ('out-of-stock', 'available', 'borrowed')) DEFAULT 'available',
    available_stock INT DEFAULT 0 CHECK (available_stock >= 0),
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL -- FK
    borrow_count INT DEFAULT 0 CHECK (borrow_count >= 0)
);

-- Book Copy
CREATE TABLE book_copies (
    copy_id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES book_titles(book_id) ON DELETE CASCADE, -- FK
    condition INT CHECK (condition BETWEEN 0 AND 100),
    status VARCHAR(50) DEFAULT 'normal',
    copy_price NUMERIC(10,2) CHECK (copy_price >= 0),
    availability BOOLEAN DEFAULT TRUE
    borrowed BOOLEAN DEFAULT FALSE
);


-- BORROWING ---------------------------------------------------------------------------------
-- Borrow Request
CREATE TABLE borrow_requests (
    request_id SERIAL PRIMARY KEY, -- PK
    reader_id INT REFERENCES readers(reader_id), -- FK
    copy_id INT REFERENCES book_copies(copy_id), -- FK
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pickup_date TIMESTAMP,   
    status VARCHAR(20) CHECK (status IN ('pending', 'approved')) DEFAULT 'pending'
);

-- Borrowing Record
CREATE TABLE borrowing_records (
    borrow_id SERIAL PRIMARY KEY, -- PK
    reader_id INT REFERENCES readers(reader_id), -- FK
    copy_id INT REFERENCES book_copies(copy_id), -- FK
    request_id INT REFERENCES borrow_requests(request_id) ON DELETE SET NULL, -- FK
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    borrowed_copy_price NUMERIC(10,2), -- Snapshot of copy_price when borrowed
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'returned', 'overdue', 'lost')) DEFAULT 'pending',
    renew_count INT DEFAULT 0 CHECK (renew_count >= 0),
    UNIQUE (reader_id, copy_id)
);

-- Return Request
CREATE TABLE return_requests (
    return_id SERIAL PRIMARY KEY, -- PK
    reader_id INT REFERENCES readers(reader_id), -- FK
    borrow_id INT REFERENCES borrowing_records(borrow_id), -- FK
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved')) DEFAULT 'pending'
);

-- Receipt
CREATE TABLE receipts (
    receipt_id SERIAL PRIMARY KEY, -- PK
    reader_id INT REFERENCES readers(reader_id), -- FK
    return_id INT UNIQUE REFERENCES return_requests(return_id), -- FK
    overdue_rate NUMERIC(5,2),
    overdue_days INT,
    damage_rate NUMERIC(5,2),
    total_fee NUMERIC(10,2)
);

-- Borrow History
CREATE TABLE borrow_history (
    history_id SERIAL PRIMARY KEY, -- PK
    reader_id INT REFERENCES readers(reader_id), -- FK
    borrow_id INT UNIQUE REFERENCES borrowing_records(borrow_id), -- FK
    status VARCHAR(20) CHECK (status IN ('on-time', 'overdue'))
);


-- NOTIFICATION ---------------------------------------------------------------------------------
-- Notification Types
CREATE TABLE notification_types (
    type_id SERIAL PRIMARY KEY, -- PK
    recipient_role VARCHAR(20) CHECK (recipient_role IN ('reader', 'librarian')) NOT NULL,
    type_name VARCHAR(50) UNIQUE NOT NULL
);

-- Notifications
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY, -- PK
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- FK
    type_id INT NOT NULL REFERENCES notification_types(type_id) ON DELETE CASCADE, -- FK
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    
    borrow_request_id INT REFERENCES borrow_requests(request_id) ON DELETE SET NULL, -- FK
    borrow_id INT REFERENCES borrowing_records(borrow_id) ON DELETE SET NULL, -- FK
    return_request_id INT REFERENCES return_requests(return_id) ON DELETE SET NULL, -- FK
    receipt_id INT REFERENCES receipts(receipt_id) ON DELETE SET NULL -- FK
);

-- ===============================================
-- SEMANTIC CONSTRAINTS AND TRIGGERS
-- ===============================================

-- 1. Update availability and stock when condition < 60
CREATE OR REPLACE FUNCTION update_copy_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.condition < 60 THEN
        NEW.availability := FALSE;
    END IF;
    UPDATE book_titles
    SET available_stock = (
        SELECT COUNT(*) FROM book_copies WHERE book_id = NEW.book_id AND availability = TRUE
    ),
    availability_status = CASE
        WHEN (SELECT COUNT(*) FROM book_copies WHERE book_id = NEW.book_id AND availability = TRUE) = 0 THEN 'out-of-stock'
        ELSE 'available'
    END
    WHERE book_id = NEW.book_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_copy_availability
AFTER INSERT OR UPDATE ON book_copies
FOR EACH ROW
EXECUTE FUNCTION update_copy_availability();

-- 2. Limit to 5 active borrows per reader
CREATE OR REPLACE FUNCTION check_borrow_limit()
RETURNS TRIGGER AS $$
DECLARE
    active_borrows INT;
BEGIN
    SELECT COUNT(*) INTO active_borrows
    FROM borrowing_records
    WHERE reader_id = NEW.reader_id AND status = 'approved';

    IF active_borrows >= 5 THEN
        RAISE EXCEPTION 'Borrow limit exceeded: maximum 5 active books per reader.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_borrow_limit
BEFORE INSERT ON borrowing_records
FOR EACH ROW
EXECUTE FUNCTION check_borrow_limit();

-- 3. Set borrowed_copy_price snapshot when creating borrowing record
CREATE OR REPLACE FUNCTION set_borrowed_snapshot()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically set borrowed_copy_price from current copy_price
    SELECT copy_price
    INTO NEW.borrowed_copy_price
    FROM book_copies
    WHERE copy_id = NEW.copy_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_borrowed_snapshot
BEFORE INSERT ON borrowing_records
FOR EACH ROW
EXECUTE FUNCTION set_borrowed_snapshot();

-- 4. Pickup date validation
CREATE OR REPLACE FUNCTION validate_pickup_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.pickup_date <= NEW.request_date THEN
        RAISE EXCEPTION 'Pickup date must be later than request date.';
    END IF;

    IF EXTRACT(HOUR FROM NEW.pickup_date::timestamp) >= 20 THEN
        RAISE EXCEPTION 'Pickup must be scheduled before 8:00 PM.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_pickup_date
BEFORE INSERT ON borrow_requests
FOR EACH ROW
EXECUTE FUNCTION validate_pickup_date();

-- 5. Update Book Copy's condition and price when receipt is issued
CREATE OR REPLACE FUNCTION apply_receipt_updates()
RETURNS TRIGGER AS $$
DECLARE
    v_copy_id INT;
    v_book_price NUMERIC(10,2);
    v_old_condition INT;
    v_old_copy_price NUMERIC(10,2);
    v_borrowed_copy_price NUMERIC(10,2);
    v_new_condition INT;
    v_new_copy_price NUMERIC(10,2);
BEGIN
    -- Get values BEFORE updating (old values from book_copies and borrowed snapshot)
    SELECT br.copy_id, bc.condition, bc.copy_price, bt.price, br.borrowed_copy_price
    INTO v_copy_id, v_old_condition, v_old_copy_price, v_book_price, v_borrowed_copy_price
    FROM borrowing_records br
    JOIN book_copies bc ON br.copy_id = bc.copy_id
    JOIN book_titles bt ON bc.book_id = bt.book_id
    WHERE br.borrow_id = (
        SELECT borrow_id FROM return_requests WHERE return_id = NEW.return_id
    );
    
    -- Calculate new condition and copy_price
    v_new_condition := GREATEST(v_old_condition - NEW.damage_rate, 0);
    v_new_copy_price := v_book_price * (v_new_condition / 100.0);
    
    -- Calculate total fee using BORROWED price (snapshot when borrowed)
    -- Overdue fee = borrowed_copy_price * overdue_rate%
    -- Damage fee = borrowed_copy_price - new_copy_price
    NEW.total_fee := COALESCE(v_borrowed_copy_price * (NEW.overdue_rate / 100.0), 0)
                   + COALESCE(v_borrowed_copy_price - v_new_copy_price, 0);
    
    -- NOW update the book_copies table
    UPDATE book_copies
    SET condition = v_new_condition,
        copy_price = v_new_copy_price
    WHERE copy_id = v_copy_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_apply_receipt_updates ON receipts;

CREATE TRIGGER trg_apply_receipt_updates
BEFORE INSERT OR UPDATE ON receipts
FOR EACH ROW
EXECUTE FUNCTION apply_receipt_updates();

