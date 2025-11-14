-- This script is now used to disable the database trigger for debugging purposes.
DROP TRIGGER IF EXISTS trg_book_copies_after_change ON book_copies;
