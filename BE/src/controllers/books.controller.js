const { pool } = require('../config/database');
const BorrowRequest = require('../models/borrowRequest.model');

const getBooks = async (req, res) => {
    try {
        const userId = req.user ? (req.user.id || req.user.user_id) : null;
        const { search, filter = 'All' } = req.query;

        let query;
        let queryParams = [];
        let whereClause = 'WHERE bt.available_stock > 0 ';

        let baseCondition = 'WHERE bt.is_deleted = FALSE ';

        if (search) {
            queryParams.push(`%${search}%`);
            const searchParamIndex = queryParams.length;
            let searchCondition = '';
            switch (filter) {
                case 'Title':
                    searchCondition = `bt.title ILIKE $${searchParamIndex} `;
                    break;
                case 'Author':
                    searchCondition = `bt.author ILIKE $${searchParamIndex} `;
                    break;
                case 'Publisher':
                    searchCondition = `bt.publisher ILIKE $${searchParamIndex} `;
                    break;
                case 'Date':
                    queryParams[searchParamIndex - 1] = `${search}%`;
                    searchCondition = `CAST(bt.publish_year AS TEXT) LIKE $${searchParamIndex} `;
                    break;
                case 'All':
                default:
                    searchCondition = `(bt.title ILIKE $${searchParamIndex} OR bt.author ILIKE $${searchParamIndex}) `;
                    break;
            }
            whereClause += `AND ${searchCondition}`;
        }

        if (whereClause) {
            whereClause = whereClause.replace('WHERE', 'AND');
            whereClause = baseCondition + whereClause;
        } else {
            whereClause = baseCondition;
        }


        if (userId) {
            // Get reader's borrowing preferences from both history and current borrowings
            const preferenceQuery = `
                SELECT
                    c.category_name,
                    c.category_id,
                    COUNT(*) as borrow_count
                FROM (
                    -- Get categories from borrow history
                    SELECT bh.copy_id
                    FROM borrow_history bh
                    WHERE bh.reader_id = (SELECT reader_id FROM readers WHERE user_id = $1)
                    
                    UNION ALL
                    
                    -- Get categories from current borrowing records
                    SELECT br.copy_id
                    FROM borrowing_records br
                    WHERE br.reader_id = (SELECT reader_id FROM readers WHERE user_id = $1)
                ) AS all_borrows
                JOIN book_copies bc ON all_borrows.copy_id = bc.copy_id
                JOIN book_titles bt ON bc.book_id = bt.book_id
                LEFT JOIN categories c ON bt.category_id = c.category_id
                WHERE c.category_name IS NOT NULL
                GROUP BY c.category_id, c.category_name
                ORDER BY borrow_count DESC
                LIMIT 3
            `;
            const { rows: preferenceRows } = await pool.query(preferenceQuery, [userId]);

            const preferredCategories = preferenceRows.map(r => r.category_name);

            let orderByClause = 'ORDER BY ';
            let categoryFilter = '';
            
            if (preferredCategories.length > 0) {
                // Add WHERE clause to filter ONLY books from preferred categories (top 1 only)
                const topCategory = preferredCategories[0];
                const categoryParamIndex = queryParams.length + 1;
                categoryFilter = ` AND c.category_name = $${categoryParamIndex}`;
                queryParams.push(topCategory);
                
                // Sort by availability and book_id
                orderByClause = 'ORDER BY bt.available_stock DESC, bt.book_id DESC';
            } else {
                // If no borrowing history, sort by availability and popularity
                orderByClause = 'ORDER BY bt.available_stock DESC, bt.borrow_count DESC, bt.book_id DESC';
            }

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
                INNER JOIN
                    categories c ON bt.category_id = c.category_id
                ${whereClause}${categoryFilter}
                GROUP BY
                    bt.book_id, c.category_id
                ${orderByClause}
            `;

        } else {
            // For non-authenticated users, sort by popularity (borrow_count) and availability
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
                    bt.available_stock AS available_stock_for_borrow,
                    bt.borrow_count
                FROM
                    book_titles bt
                LEFT JOIN
                    categories c ON bt.category_id = c.category_id
                ${whereClause}
                GROUP BY
                    bt.book_id, c.category_id
                ORDER BY
                    bt.available_stock DESC,
                    bt.borrow_count DESC,
                    bt.book_id DESC
            `;
        }

        const { rows } = await pool.query(query, queryParams);

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
            available_stock: parseInt(book.available_stock_for_borrow)
        }));

        res.json({
            books: books,
            pagination: {
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

                userBorrowCount = await BorrowRequest.countTotalActiveRequestsAndBorrowings(readerId);

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