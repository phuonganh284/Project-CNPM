const { pool } = require('../config/database');

// CREATE NEW COPY ----------------------------------------------------
async function createCopy(data) {
    const {
        book_id,
        status = 'Available',
        availability = true,
        borrowed = false
    } = data;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Get the book's price
        const bookRes = await client.query(
            `SELECT price FROM book_titles WHERE book_id = $1`,
            [book_id]
        );
        if (bookRes.rows.length === 0) {
            throw new Error("Book not found");
        }
        const copy_price = bookRes.rows[0].price;
        const condition = 100;

        const result = await client.query(
            `INSERT INTO book_copies (book_id, condition, status, copy_price, availability, borrowed) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING copy_id`,
            [book_id, condition, status, copy_price, availability, borrowed]
        );
        const copy_id = result.rows[0].copy_id;

        // update book_titles stock (ko update available_stock vi availability tu trigger roi)
        await client.query(
            `UPDATE book_titles
             SET total_stock = total_stock + 1,
                 available_stock = available_stock + 0
             WHERE book_id = $1`,
            [book_id]
        );

        await client.query('COMMIT');
        return { success: true, copy_id };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}


// READ COPY BY ID ----------------------------------------------------
async function getCopiesByBookId(bookId) {
    const result = await pool.query(
        `SELECT copy_id, book_id, condition, status, copy_price, availability, borrowed
        FROM book_copies
        WHERE book_id = $1 AND availability = TRUE
        ORDER BY copy_id ASC`,
        [bookId]
    );
    return result.rows;
}


// DELETE COPY BY ID ----------------------------------------------------
async function deleteCopy(copyId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // get info about the copy
        const copyRes = await client.query(
            `SELECT book_id, availability, borrowed FROM book_copies WHERE copy_id = $1`,
            [copyId]
        );
        if (copyRes.rows.length === 0) {
            throw new Error("Copy not found");
        }
        const { book_id, availability, borrowed } = copyRes.rows[0];
        if (borrowed) {
            throw new Error("Cannot delete a borrowed copy");
        }

        // mark copy as unavailable
        await client.query(
            `UPDATE book_copies SET availability = FALSE WHERE copy_id = $1`,
            [copyId]
        );

        // ko update available_stock vi availability tu trigger roi
        await client.query('COMMIT');
        return { success: true };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}


module.exports = {
    createCopy,
    getCopiesByBookId,
    deleteCopy
};
