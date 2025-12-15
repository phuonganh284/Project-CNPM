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
            LEFT JOIN borrow_requests br ON bc.copy_id = br.copy_id AND br.status IN ('pending', 'approved')
            WHERE bc.book_id = $1
              AND bc.availability = TRUE
              AND bc.borrowed = FALSE
              AND bc.condition >= $2
              AND br.request_id IS NULL
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

    // Backwards-compatible wrapper expected by controllers
    static async getCopiesByBookId(book_id, available_only = false) {
        return await this.findByBookId(book_id, available_only);
    }

    // Create a new copy record
    static async createCopy({ book_id, condition = 100, status = 'normal', copy_price = 0, availability = true, borrowed = false }) {
        if (!book_id) throw new Error('book_id is required');

        const query = `
            INSERT INTO book_copies (book_id, condition, status, copy_price, availability, borrowed)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const result = await pool.query(query, [book_id, condition, status, copy_price, availability, borrowed]);
        return result.rows[0];
    }

    // Soft-delete a copy (mark unavailable)
    static async deleteCopy(copy_id) {
        if (!copy_id) throw new Error('copy_id is required');

        // Ensure the copy exists
        const existing = await this.findById(copy_id);
        if (!existing) throw new Error('Copy not found');

        // Prevent deletion if currently borrowed
        if (existing.borrowed === true) {
            throw new Error('Cannot delete: copy is currently borrowed');
        }

        // Prevent deletion if there are pending/approved borrow requests for this copy
        const reqQuery = `
            SELECT COUNT(*) as count
            FROM borrow_requests
            WHERE copy_id = $1
              AND status IN ('pending', 'approved')
        `;
        const reqRes = await pool.query(reqQuery, [copy_id]);
        if (parseInt(reqRes.rows[0].count) > 0) {
            throw new Error('Cannot delete: copy has pending or approved borrow requests');
        }

        // Prevent deletion if there are active borrowing records for this copy
        const brQuery = `
            SELECT COUNT(*) as count
            FROM borrowing_records
            WHERE copy_id = $1
              AND status IN ('pending', 'approved')
        `;
        const brRes = await pool.query(brQuery, [copy_id]);
        if (parseInt(brRes.rows[0].count) > 0) {
            throw new Error('Cannot delete: copy has active borrowing records');
        }

        // Mark availability false (do not hard-delete)
        const query = `
            UPDATE book_copies
            SET availability = FALSE
            WHERE copy_id = $1
            RETURNING *
        `;

        const result = await pool.query(query, [copy_id]);
        return result.rows[0] || null;
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