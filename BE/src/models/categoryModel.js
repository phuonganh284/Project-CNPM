const { pool } = require('../config/database');

// CREATE NEW CATEGORY ------------------------------------------------
async function createCategory(name) {
    if (!name) return null;
    const client = await pool.connect();
    try {
        // Try to insert. If it already exists, do nothing and we'll select the existing row.
        const insert = await client.query(
            'INSERT INTO categories (category_name, amount) VALUES ($1, 0) ON CONFLICT (category_name) DO NOTHING RETURNING category_id, category_name',
            [name]
        );
        if (insert.rows.length > 0) return insert.rows[0];

        // If insert did nothing (duplicate), select the existing category
        const select = await client.query('SELECT category_id, category_name FROM categories WHERE category_name = $1', [name]);
        return select.rows[0] || null;
    } finally {
        client.release();
    }
}


// READ CATEGORIES ------------------------------------------------
async function getAllCategories() {
    const result = await pool.query('SELECT category_id, category_name FROM categories ORDER BY category_name ASC');
    return result.rows;
}

async function getCategoryByName(name) {
    if (!name) return null;
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT category_id FROM categories WHERE category_name = $1', [name]);
        if (result.rows.length === 0) return null;
        return result.rows[0].category_id;
    } finally {
        client.release();
    }
}

// DELETE CATEGORY ------------------------------------------------
async function deleteCategory(categoryId) {
    const result = await pool.query('DELETE FROM categories WHERE category_id = $1 RETURNING *', [categoryId]);
    return result.rows[0];
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryByName,
    deleteCategory
};