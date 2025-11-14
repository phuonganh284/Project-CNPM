const { pool } = require('../config/database');

class CopyModel {
    static async setBorrowedStatus(copy_id, isBorrowed, client = pool) {
        if (!copy_id) {
            throw new Error('copy_id is required');
        }

        if (typeof isBorrowed !== 'boolean') {
            throw new Error('isBorrowed must be a boolean');
        }

        const query = `
            UPDATE book_copies
            SET borrowed = $2
            WHERE copy_id = $1
            RETURNING copy_id, borrowed;
        `;

        const result = await client.query(query, [copy_id, isBorrowed]);
        return result.rows[0];
    }

    static async findBestAvailableCopy(book_id, min_condition = 50) {
        if (!book_id) {
            throw new Error('book_id is required');
        }

        if (min_condition < 0 || min_condition > 100) {
            throw new Error('min_condition must be between 0 and 100');
        }

        const query = `
            SELECT
                bc.copy_id,
                bc.book_id,
                bc.condition,
                bc.status,
                bc.copy_price,
                bc.availability,
                bt.title,
                bt.author,
                bt.price as book_price
            FROM book_copies bc
            JOIN book_titles bt ON bc.book_id = bt.book_id
            WHERE bc.book_id = $1
              AND bc.availability = TRUE
              AND bc.borrowed = FALSE
              AND bc.condition >= $2
            ORDER BY bc.condition DESC, bc.copy_id ASC
            LIMIT 1
        `;

        const result = await pool.query(query, [book_id, min_condition]);
        return result.rows[0] || null;
    }

    static async findById(copy_id) {
        if (!copy_id) {
            throw new Error('copy_id is required');
        }

        const query = `
            SELECT
                bc.copy_id,
                bc.book_id,
                bc.condition,
                bc.status,
                bc.copy_price,
                bc.availability,
                bt.title,
                bt.author,
                bt.publisher,
                bt.publish_year,
                bt.price as book_price,
                bt.isbn,
                bt.cover
            FROM book_copies bc
            JOIN book_titles bt ON bc.book_id = bt.book_id
            WHERE bc.copy_id = $1
        `;

        const result = await pool.query(query, [copy_id]);
        return result.rows[0] || null;
    }

    static async findByBookId(book_id, available_only = false) {
        if (!book_id) {
            throw new Error('book_id is required');
        }

        let query = `
            SELECT
                copy_id,
                book_id,
                condition,
                status,
                copy_price,
                availability,
                borrowed
            FROM book_copies
            WHERE book_id = $1
        `;

        if (available_only) {
            query += ' AND availability = TRUE AND borrowed = FALSE';
        }

        query += ' ORDER BY condition DESC, copy_id ASC';

        const result = await pool.query(query, [book_id]);
        return result.rows;
    }

    static async countAvailableCopies(book_id, min_condition = 50) {
        if (!book_id) {
            throw new Error('book_id is required');
        }

        const query = `
            SELECT COUNT(*) as count
            FROM book_copies
            WHERE book_id = $1
              AND availability = TRUE
              AND borrowed = FALSE
              AND condition >= $2
        `;

        const result = await pool.query(query, [book_id, min_condition]);
        return parseInt(result.rows[0].count);
    }

    static async updateAvailability(copy_id, availability) {
        if (!copy_id) {
            throw new Error('copy_id is required');
        }

        if (typeof availability !== 'boolean') {
            throw new Error('availability must be a boolean');
        }

        const existing = await this.findById(copy_id);
        if (!existing) {
            throw new Error('Copy not found');
        }

        const query = `
            UPDATE book_copies
            SET availability = $2
            WHERE copy_id = $1
            RETURNING *
        `;

        const result = await pool.query(query, [copy_id, availability]);
        return result.rows[0];
    }

    static async updateCondition(copy_id, new_condition) {
        if (!copy_id) {
            throw new Error('copy_id is required');
        }

        if (new_condition < 0 || new_condition > 100) {
            throw new Error('condition must be between 0 and 100');
        }

        const existing = await this.findById(copy_id);
        if (!existing) {
            throw new Error('Copy not found');
        }

        const new_copy_price = (existing.book_price * new_condition) / 100;

        const query = `
            UPDATE book_copies
            SET condition = $2,
                copy_price = $3
            WHERE copy_id = $1
            RETURNING *
        `;

        const result = await pool.query(query, [copy_id, new_condition, new_copy_price]);
        return result.rows[0];
    }
}

module.exports = CopyModel;