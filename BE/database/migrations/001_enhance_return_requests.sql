-- ========================================
-- MIGRATION: Enhance return workflow
-- Add columns for proper condition tracking
-- ========================================

-- 1. Add borrowed_condition to borrowing_records (snapshot when borrowed)
ALTER TABLE borrowing_records
ADD COLUMN IF NOT EXISTS borrowed_condition INT CHECK (borrowed_condition BETWEEN 0 AND 100);

-- Update trigger to also snapshot borrowed_condition
CREATE OR REPLACE FUNCTION set_borrowed_snapshot()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically set borrowed_copy_price and borrowed_condition from current copy
    SELECT copy_price, condition
    INTO NEW.borrowed_copy_price, NEW.borrowed_condition
    FROM book_copies
    WHERE copy_id = NEW.copy_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-create trigger
DROP TRIGGER IF EXISTS trg_set_borrowed_snapshot ON borrowing_records;
CREATE TRIGGER trg_set_borrowed_snapshot
BEFORE INSERT ON borrowing_records
FOR EACH ROW
EXECUTE FUNCTION set_borrowed_snapshot();

-- 2. Add missing columns to return_requests
ALTER TABLE return_requests
ADD COLUMN IF NOT EXISTS returned_condition INT CHECK (returned_condition BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS assessed_condition VARCHAR(20) CHECK (assessed_condition IN ('OK', 'MINOR', 'MODERATE', 'SEVERE', 'LOST')),
ADD COLUMN IF NOT EXISTS damage_percentage NUMERIC(5,2) CHECK (damage_percentage BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS overdue_fee NUMERIC(10,2) DEFAULT 0 CHECK (overdue_fee >= 0),
ADD COLUMN IF NOT EXISTS damage_fee NUMERIC(10,2) DEFAULT 0 CHECK (damage_fee >= 0),
ADD COLUMN IF NOT EXISTS total_fee NUMERIC(10,2) DEFAULT 0 CHECK (total_fee >= 0),
ADD COLUMN IF NOT EXISTS damage_details JSONB,
ADD COLUMN IF NOT EXISTS assessment_notes TEXT,
ADD COLUMN IF NOT EXISTS assessed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

-- 3. Update status enum to include 'assessed' and 'completed'
ALTER TABLE return_requests 
DROP CONSTRAINT IF EXISTS return_requests_status_check;

ALTER TABLE return_requests
ADD CONSTRAINT return_requests_status_check 
CHECK (status IN ('pending', 'assessed', 'completed'));

-- Verify migration
SELECT 'Migration completed! Enhanced return workflow tables.' as status;

SELECT 'borrowing_records columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'borrowing_records' AND column_name LIKE '%borrowed%'
ORDER BY ordinal_position;

SELECT 'return_requests columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'return_requests'
ORDER BY ordinal_position;
