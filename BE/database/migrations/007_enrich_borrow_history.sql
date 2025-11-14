-- Enrich borrow_history to be a self-contained record of a completed return
-- This allows deleting from borrowing_records and return_requests after archiving.

-- Add columns for fee and assessment details
ALTER TABLE borrow_history ADD COLUMN late_fee NUMERIC(10,2) DEFAULT 0;
ALTER TABLE borrow_history ADD COLUMN damage_fee NUMERIC(10,2) DEFAULT 0;
ALTER TABLE borrow_history ADD COLUMN total_fee NUMERIC(10,2) DEFAULT 0;
ALTER TABLE borrow_history ADD COLUMN librarian_assessed_condition VARCHAR(50);
ALTER TABLE borrow_history ADD COLUMN reader_returned_condition INT;
ALTER TABLE borrow_history ADD COLUMN assessment_notes TEXT;

-- Add a reference to the original return_id for traceability
ALTER TABLE borrow_history ADD COLUMN return_id INT;

COMMENT ON TABLE borrow_history IS 'Stores a self-contained historical record of completed borrowings, enriched with assessment and fee details from the return request. Data is copied upon return completion.';
