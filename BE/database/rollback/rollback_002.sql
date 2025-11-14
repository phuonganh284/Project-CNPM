-- Drop the trigger from the book_copies table
DROP TRIGGER IF EXISTS trg_book_copies_after_change ON book_copies;

-- Drop the trigger function
DROP FUNCTION IF EXISTS update_book_title_available_stock();

-- Drop the calculation function
DROP FUNCTION IF EXISTS calculate_available_stock(p_book_id INT);
