-- Step 1: Drop the existing foreign key constraint and UNIQUE constraint on borrow_id
ALTER TABLE borrow_history DROP CONSTRAINT IF EXISTS borrow_history_borrow_id_fkey;
ALTER TABLE borrow_history DROP CONSTRAINT IF EXISTS borrow_history_borrow_id_key;

-- Step 2: Add new columns to store the actual data
ALTER TABLE borrow_history ADD COLUMN copy_id INT;
ALTER TABLE borrow_history ADD COLUMN borrow_date TIMESTAMP;
ALTER TABLE borrow_history ADD COLUMN due_date TIMESTAMP;
ALTER TABLE borrow_history ADD COLUMN return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE borrow_history ADD COLUMN borrowed_copy_price NUMERIC(10,2);

-- Step 3: Change borrow_id to just be an integer for historical record keeping
-- The column already exists, so we just need to ensure it's treated as a plain integer now.
-- No change needed here as the FK is already dropped.

-- Optional: Add a comment to the table to explain its new purpose
COMMENT ON TABLE borrow_history IS 'Stores a self-contained historical record of completed borrowings. Data is copied from borrowing_records upon return.';
