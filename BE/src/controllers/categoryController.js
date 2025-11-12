const CategoryModel = require('../models/categoryModel');



async function getCategories(req, res) {
    try {
        const categories = await CategoryModel.getAllCategories();
        return res.json({ success: true, data: categories });
    } catch (err) {
        console.error('Error getting categories', err);
        return res.status(500).json({ success: false, message: 'Error getting categories' });
    }
}

async function createCategory(req, res) {
    try {
        const { category_name, name } = req.body || {};
        const catName = category_name || name;
        if (!catName) {
            return res.status(400).json({ success: false, message: 'category_name is required' });
        }

        const category = await CategoryModel.createCategory(catName);
        return res.status(201).json({ success: true, data: category });
    } catch (err) {
        console.error('Error creating category', err);
        return res.status(500).json({ success: false, message: 'Error creating category' });
    }
}

module.exports = {
    getCategories,
    createCategory
};
