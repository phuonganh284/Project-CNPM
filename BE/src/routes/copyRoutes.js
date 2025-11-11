const express = require('express');
const router = express.Router();
const copyController = require('../controllers/copyController');

router.get('/:bookId', copyController.getCopies); // GET /copies/:bookId
router.post("/book/:bookId", copyController.createCopy); // POST /copies/book/:bookId
router.delete('/:copyId', copyController.deleteCopy); // DELETE /copies/:copiesId

module.exports = router;
