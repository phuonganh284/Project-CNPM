const CopyModel = require('../models/copyModel');
const BookModel = require('../models/bookModel');

// GET ALL COPIES OF A BOOK --------------------------------------------
async function getCopies(req, res) {
    try {
        const { bookId } = req.params;
        if (!bookId) {
            return res.status(400).json({ success: false, message: 'bookId is required' });
        }

        const copies = await CopyModel.getCopiesByBookId(bookId);
        return res.json({ success: true, data: copies });
    } catch (err) {
        console.error('Error getting copies:', err);
        return res.status(500).json({ success: false, message: 'Error getting copies' });
    }
}

// CREATE NEW COPY -----------------------------------------------------
async function createCopy(req, res) {
    try {
        const { book_id } = req.body;

        if (!book_id) {
            return res.status(400).json({ success: false, message: 'book_id is required' });
        }

        // fetch the book title info to get its price
        const book = await BookModel.getBookById(book_id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        const result = await CopyModel.createCopy({
            book_id,
            condition: 100,           // default condition
            status: 'normal',         // default status
            copy_price: book.price,   // copy price same as title price
            availability: true,
            borrowed: false
        });

        return res.status(201).json({ success: true, data: result });
    } catch (err) {
        console.error('Error creating copy:', err);
        return res.status(500).json({ success: false, message: 'Error creating copy' });
    }
}


// DELETE COPY (mark hidden) -------------------------------------------
async function deleteCopy(req, res) {
    try {
        const { copyId } = req.params;
        if (!copyId) {
            return res.status(400).json({ success: false, message: 'copyId is required' });
        }

        const result = await CopyModel.deleteCopy(copyId);
        return res.json({ success: true, message: 'Copy deleted successfully', data: result });
    } catch (err) {
        console.error('Error deleting copy:', err);
        return res.status(500).json({ success: false, message: err.message || 'Error deleting copy' });
    }
}

module.exports = {
    getCopies,
    createCopy,
    deleteCopy
};
