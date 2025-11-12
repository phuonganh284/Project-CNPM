const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/', categoryController.createCategory); // POST /categories
router.get('/', categoryController.getCategories); // GET /categories
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await require("../models/categoryModel").deleteCategory(req.params.id);
        if (deleted) return res.json({ success: true, data: deleted });
        return res.status(404).json({ success: false, message: "Category not found" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete category" });
    }
});

module.exports = router;
