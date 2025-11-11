const BookModel = require('../models/bookModel');
const CategoryModel = require('../models/categoryModel');
// 1. create book (title and copies)
async function createBook(req, res) {
    try {
        const data = req.body;
        // allow callers to pass category_name instead of category_id
        // if category_id is missing but category_name provided, try to find or create 
        if (!data.category_id) {
            if (data.category_name) {
                try {
                    const catId = await CategoryModel.getCategoryByName(data.category_name);
                    data.category_id = catId;
                } catch (err) {
                    console.error('Error finding/creating category:', err.message);
                }
            }
        }

        if (!data.category_id) {
            return res.status(400).json({
                success: false,
                error: "category_id is required and must refer to an existing category."
            });
        }
        if (!data.title || data.title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: "title cannot be empty."
            });
        }

        const result = await BookModel.createBookTitle(data);

        // return full book object
        try {
            const full = await BookModel.getBookById(result.bookId);
            return res.status(201).json({ success: true, message: 'Book created successfully.', data: full });
        } catch (err) {
            return res.status(201).json({ success: true, message: 'Book created successfully.', data: result });
        }
    } catch (err) {
        console.error("Error creating book:", err);
        // constraints violation
        if (err && err.code === '23505') {
            const detail = err.detail || 'Duplicate value violates unique constraint.';
            return res.status(400).json({ success: false, error: detail });
        }
        res.status(500).json({ success: false, error: err.message || String(err) });
    }
}

// 2. get all books
async function getBooks(req, res) {
    try {
        const books = await BookModel.getAllBookTitles();
        res.json({ success: true, data: books });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// 3. get book with specific id
async function getBookById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const book = await BookModel.getBookById(id);
        res.json({ success: true, data: book });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// 4. get copies of a specific book
async function getBookCopies(req, res) {
    try {
        const id = parseInt(req.params.id);
        const copies = await BookModel.getBookCopies(id);

        if (copies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No copies found or book not available."
            });
        }

        res.json({ success: true, data: copies });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// 5. delete a book
async function deleteBook(req, res) {
    try {
        const id = parseInt(req.params.id);
        const deleted = await BookModel.deleteBook(id);

        if (!deleted || deleted.success === false) {
            const msg = (deleted && (deleted.error || deleted.message)) || 'Book not found.';
            const status = deleted && deleted.error && deleted.error.toLowerCase().includes('cannot delete') ? 400 : 404;
            return res.status(status).json({ success: false, message: msg });
        }

        res.json({ success: true, message: deleted.message || "Book deleted successfully." });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// 6. update a book
async function updateBook(req, res) {
    try {
        const id = parseInt(req.params.id);
        const fields = req.body;
        // map category_name to category_id
        if (fields.category_name && !fields.category_id) {
            try {
                const catId = await CategoryModel.getCategoryByName(fields.category_name);
                fields.category_id = catId;
            } catch (err) {
                console.error('Error finding/creating category during update:', err.message);
            }
        }
        // remove category_name
        delete fields.category_name;
        const updated = await BookModel.updateBook(id, fields);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Book not found.' });
        }
        // fetch books to display UI
        try {
            const full = await BookModel.getBookById(id);
            return res.json({ success: true, data: full, message: "Book updated successfully." });
        } catch (err) {
            return res.json({ success: true, data: updated, message: "Book updated successfully." });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = {
    createBook,
    getBooks,
    getBookById,
    deleteBook,
    updateBook,
    getBookCopies
};
