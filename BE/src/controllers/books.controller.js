const { pool } = require('../config/database');
const BorrowRequest = require('../models/borrowRequest.model'); // Import BorrowRequest model

const getBooks = async (req, res) => {
    try {
        const userId = req.user ? req.user.user_id : null;
        const { search, filter = 'All' } = req.query;

        let query;
        let queryParams = [];
        let whereClause = '';

        if (search) {
            queryParams.push(`%${search}%`);
            const searchParamIndex = queryParams.length;
            switch (filter) {
                case 'Title':
                    whereClause = `WHERE bt.title ILIKE $${searchParamIndex} `;
                    break;
                case 'Author':
                    whereClause = `WHERE bt.author ILIKE $${searchParamIndex} `;
                    break;
                case 'Publisher':
                    whereClause = `WHERE bt.publisher ILIKE $${searchParamIndex} `;
                    break;
                case 'Date':
                    // For date, we assume the search term is a year.
                    // We'll cast the column to TEXT to use LIKE.
                    queryParams[searchParamIndex - 1] = `${search}%`; // No leading wildcard for year
                    whereClause = `WHERE CAST(bt.publish_year AS TEXT) LIKE $${searchParamIndex} `;
                    break;
                case 'All':
                default:
                    whereClause = `WHERE (bt.title ILIKE $${searchParamIndex} OR bt.author ILIKE $${searchParamIndex}) `;
                    break;
            }
        }

        if (userId) {
            // First, get the user's preferred categories and authors from their borrow history
            const preferenceQuery = `
                SELECT
                    c.category_name,
                    bt.author
                FROM
                    borrowing_records br
                JOIN
                    book_copies bc ON br.copy_id = bc.copy_id
                JOIN
                    book_titles bt ON bc.book_id = bt.book_id
                JOIN
                    categories c ON bt.category_id = c.category_id
                WHERE
                    br.reader_id = (SELECT reader_id FROM readers WHERE user_id = $1)
            `;
            // In the preference query, the user id is always the first parameter.
            const { rows: preferenceRows } = await pool.query(preferenceQuery, [userId]);

            const preferredCategories = [...new Set(preferenceRows.map(r => r.category_name))];
            const preferredAuthors = [...new Set(preferenceRows.map(r => r.author))];

            let orderByClause = 'ORDER BY ';
            if (preferredCategories.length > 0 || preferredAuthors.length > 0) {
                orderByClause += 'CASE ';
                if (preferredCategories.length > 0) {
                    const categoryParamIndex = queryParams.length + 1;
                    orderByClause += `WHEN c.category_name = ANY($${categoryParamIndex}) THEN 1 `;
                    queryParams.push(preferredCategories);
                }
                if (preferredAuthors.length > 0) {
                    const authorParamIndex = queryParams.length + 1;
                    orderByClause += `WHEN bt.author = ANY($${authorParamIndex}) THEN 2 `;
                    queryParams.push(preferredAuthors);
                }
                orderByClause += 'ELSE 3 END, ';
            }
            orderByClause += 'bt.book_id DESC';


            query = `
                SELECT
                    bt.book_id,
                    bt.title,
                    bt.author,
                    bt.publisher,
                    bt.publish_year,
                    bt.cover,
                    bt.price,
                    c.category_id,
                    c.category_name,
                    bt.total_stock,
                    bt.available_stock AS available_stock_for_borrow
                FROM
                    book_titles bt
                LEFT JOIN
                    categories c ON bt.category_id = c.category_id
                ${whereClause}
                GROUP BY
                    bt.book_id, c.category_id
                ${orderByClause}
            `;

        } else {
            query = `
                SELECT
                    bt.book_id,
                    bt.title,
                    bt.author,
                    bt.publisher,
                    bt.publish_year,
                    bt.cover,
                    bt.price,
                    c.category_id,
                    c.category_name,
                    bt.total_stock,
                    bt.available_stock AS available_stock_for_borrow
                FROM
                    book_titles bt
                LEFT JOIN
                    categories c ON bt.category_id = c.category_id
                ${whereClause}
                GROUP BY
                    bt.book_id, c.category_id
                ORDER BY
                    bt.book_id DESC
            `;
        }

        const { rows } = await pool.query(query, queryParams);

        // The API documentation shows that the category should be a nested object.
        const books = rows.map(book => ({
            book_id: book.book_id,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            publish_year: book.publish_year,
            cover: book.cover,
            price: book.price,
            category: {
                category_id: book.category_id,
                category_name: book.category_name
            },
            total_stock: book.total_stock,
            available_stock: parseInt(book.available_stock_for_borrow) // Use the newly calculated stock
        }));

        res.json({
            books: books,
            pagination: { // Add mock pagination for now
                page: 1,
                limit: books.length,
                total: books.length,
                totalPages: 1
            }
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const bookQuery = `
            SELECT
                bt.book_id,
                bt.isbn,
                bt.title,
                bt.author,
                bt.publisher,
                bt.publish_year,
                bt.description,
                bt.language,
                bt.cover,
                bt.price,
                c.category_id,
                c.category_name,
                bt.total_stock,
                bt.available_stock,
                bt.availability_status
            FROM
                book_titles bt
            LEFT JOIN
                categories c ON bt.category_id = c.category_id
            WHERE
                bt.book_id = $1
        `;
        const { rows: bookRows } = await pool.query(bookQuery, [id]);

        if (bookRows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const copiesQuery = `
            SELECT
                copy_id,
                condition,
                status,
                availability
            FROM
                book_copies
            WHERE
                book_id = $1
            ORDER BY condition DESC, copy_id ASC
        `;
        const { rows: copyRows } = await pool.query(copiesQuery, [id]);

        const bookData = bookRows[0];
        let userBorrowCount = 0;
        let userHasRequestedOrBorrowed = false;

        if (userId) {
            const readerResult = await pool.query('SELECT reader_id FROM readers WHERE user_id = $1', [userId]);
            if (readerResult.rows.length > 0) {
                const readerId = readerResult.rows[0].reader_id;
                const bookId = id;

                // 1. Get total active count for the user
                userBorrowCount = await BorrowRequest.countTotalActiveRequestsAndBorrowings(readerId);

                // 2. Check if user has an active borrow or request for this specific book title
                const isBorrowing = await BorrowRequest.isCurrentlyBorrowingTitle(readerId, bookId);
                const hasPending = await BorrowRequest.hasPendingRequestForBook(readerId, bookId);
                const hasApproved = await BorrowRequest.hasApprovedRequestForBook(readerId, bookId);

                if (isBorrowing || hasPending || hasApproved) {
                    userHasRequestedOrBorrowed = true;
                }
            }
        }

        const book = {
            book_id: bookData.book_id,
            isbn: bookData.isbn,
            title: bookData.title,
            author: bookData.author,
            publisher: bookData.publisher,
            publish_year: bookData.publish_year,
            description: bookData.description,
            language: bookData.language,
            cover: bookData.cover,
            price: bookData.price,
            category: {
                category_id: bookData.category_id,
                category_name: bookData.category_name
            },
            total_stock: bookData.total_stock,
            available_stock: parseInt(bookData.available_stock, 10),
            copies: copyRows,
            userBorrowCount: userBorrowCount,
            userHasRequestedOrBorrowed: userHasRequestedOrBorrowed
        };

        res.json({ book });

    } catch (error) {
        console.error(`Error fetching book with id ${req.params.id}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getBooks,
    getBookById,
};
