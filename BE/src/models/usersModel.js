const { pool } = require('../config/database');

/**
 * Model functions for users CRUD operations.
 * These functions encapsulate SQL and return plain JS objects (rows).
 */

const getAllUsers = async () => {
    // NOTE: some deployments (Supabase) may not have the borrow_count column.
    // Avoid selecting borrow_count to prevent SQL errors on schemas without it.
    // Include role information by left-joining readers and librarians tables
    // so callers can distinguish readers from librarians.
    const q = `
        SELECT u.user_id, u.username, u.email, u.name, u.status, u.profile_picture,
               CASE
                 WHEN r.user_id IS NOT NULL THEN 'reader'
                 WHEN l.user_id IS NOT NULL THEN 'librarian'
                 ELSE 'unknown'
               END AS role
        FROM users u
        LEFT JOIN readers r ON r.user_id = u.user_id
        LEFT JOIN librarians l ON l.user_id = u.user_id
        ORDER BY u.user_id
    `;
    const result = await pool.query(q);
    return result.rows;
};

const getUserById = async (id) => {
    const q = `
        SELECT u.user_id, u.username, u.email, u.name, u.status, u.profile_picture,
               CASE
                 WHEN r.user_id IS NOT NULL THEN 'reader'
                 WHEN l.user_id IS NOT NULL THEN 'librarian'
                 ELSE 'unknown'
               END AS role
        FROM users u
        LEFT JOIN readers r ON r.user_id = u.user_id
        LEFT JOIN librarians l ON l.user_id = u.user_id
        WHERE u.user_id = $1
    `;
    const result = await pool.query(q, [id]);
    return result.rows[0] || null;
};

/**
 * Update user by id. fields is an object with allowed keys: status, name, profile_picture
 * Returns updated row or null if not found.
 */
const updateUser = async (id, fields) => {
    const allowed = ['status', 'name', 'profile_picture'];
    const set = [];
    const vals = [];
    let idx = 1;

    for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(fields, key)) {
            set.push(`${key} = $${idx++}`);
            vals.push(fields[key]);
        }
    }

    if (set.length === 0) return null; // nothing to update

    vals.push(id);
    const q = `UPDATE users SET ${set.join(', ')} WHERE user_id = $${idx} RETURNING user_id, username, email, name, status, profile_picture`;
    const result = await pool.query(q, vals);
    return result.rows[0] || null;
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
};
