const { pool } = require('../config/database');

//CREATE BOOK TITLE --------------------------------------------------
async function createBookTitle(data) {
    const {
        isbn,
        cover,
        title,
        author,
        language,
        publisher,
        publish_year,
        description,
        price,
        total_stock,
        category_id
    } = data;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // insert into book_titles
        const result = await client.query(
            `INSERT INTO book_titles (
                    isbn, cover, title, author, language, publisher, publish_year,
                    description, price, total_stock, available_stock, availability_status, category_id
                ) 
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
                RETURNING book_id`,
            [
                isbn,
                cover,
                title,
                author,
                language,
                publisher,
                publish_year,
                description,
                price,
                total_stock,
                /* available_stock should initially equal total_stock */
                total_stock,
                /* availability_status based on stock */
                total_stock > 0 ? 'available' : 'out-of-stock',
                category_id
            ]
        );

        const bookId = result.rows[0].book_id;

        // create book copies based on total_stock
        for (let i = 0; i < total_stock; i++) {
            await client.query(
                `INSERT INTO book_copies (book_id, condition, status, copy_price, availability)
                VALUES ($1, $2, $3, $4, $5)`,
                [bookId, 100, 'normal', price, true]
            );
        }

        // category amount++
        await client.query(
            `UPDATE categories SET amount = amount + 1 WHERE category_id = $1`,
            [category_id]
        );

        await client.query('COMMIT');
        return { success: true, bookId };
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
}

//READ BOOK TITLE --------------------------------------------------
async function getAllBookTitles() {
    const result = await pool.query(`
    SELECT bt.*, c.category_name
    FROM book_titles bt
    LEFT JOIN categories c ON bt.category_id = c.category_id
    WHERE bt.is_deleted = FALSE
    ORDER BY bt.book_id ASC
  `);
    return result.rows;
}

async function getBookById(bookId) {
    const client = await pool.connect();
    try {
        const bookResult = await client.query(
            `SELECT bt.*, c.category_name
            FROM book_titles bt
            LEFT JOIN categories c ON bt.category_id = c.category_id
            WHERE bt.book_id = $1 AND bt.is_deleted = FALSE`,
            [bookId]
        );

        if (bookResult.rows.length === 0) {
            throw new Error('Book not found or deleted');
        }

        const copiesResult = await client.query(
            `SELECT * FROM book_copies WHERE book_id = $1 AND availability = TRUE ORDER BY copy_id ASC`,
            [bookId]
        );

        return {
            ...bookResult.rows[0],
            copies: copiesResult.rows
        };
    } finally {
        client.release();
    }
}

async function getBookCopies(bookId) {
    const result = await pool.query(
        `SELECT copy_id, condition, status, copy_price, availability, borrowed
         FROM book_copies
         WHERE book_id = $1 AND availability = TRUE
         ORDER BY copy_id ASC`,
        [bookId]
    );
    return result.rows;
}


//UPDATE BOOK TITLE --------------------------------------------------
async function updateBook(bookId, fields) {
    const allowed = new Set([
        'isbn', 'cover', 'title', 'author', 'language', 'publisher', 'publish_year',
        'description', 'price', 'total_stock', 'available_stock', 'availability_status',
        'category_id', 'borrow_count'
    ]);

    const entries = Object.entries(fields).filter(([k]) => allowed.has(k));
    if (entries.length === 0) {
        return null;
    }

    const keys = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const result = await pool.query(
        `UPDATE book_titles SET ${setClause} WHERE book_id = $${keys.length + 1} RETURNING *`,
        [...values, bookId]
    );

    return result.rows[0];
}

//DELETE (mark hidden) BOOK TITLE --------------------------------------------------
async function deleteBook(bookId) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // check if any copy is being borrowed or requested
        const checkRes = await client.query(
            `SELECT COUNT(*) AS active_count
             FROM book_copies bc
             LEFT JOIN borrow_requests br ON bc.copy_id = br.copy_id
             LEFT JOIN borrowing_records brc ON bc.copy_id = brc.copy_id
             WHERE bc.book_id = $1
               AND (
                   (br.status IN ('pending', 'approved'))
                   OR (brc.status IN ('pending', 'approved', 'borrowing'))
               )`,
            [bookId]
        );

        if (parseInt(checkRes.rows[0].active_count) > 0) {
            await client.query('ROLLBACK');
            return { success: false, error: "Cannot delete: book has active borrowings or requests." };
        }

        await client.query(`UPDATE book_titles SET is_deleted = TRUE WHERE book_id = $1`, [bookId]);
        await client.query(`UPDATE book_copies SET availability = FALSE WHERE book_id = $1`, [bookId]);

        await client.query('COMMIT');
        return { success: true, message: "Book hidden successfully." };
    } catch (err) {
        await client.query('ROLLBACK');
        return { success: false, error: err.message };
    } finally {
        client.release();
    }
}


module.exports = {
    createBookTitle,
    getAllBookTitles,
    getBookById,
    deleteBook,
    updateBook,
    getBookCopies
};


