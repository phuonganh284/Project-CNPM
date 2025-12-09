const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', bookController.createBook);     // POST /books
router.get('/', bookController.getBooks);        // GET /books
router.get('/:id', bookController.getBookById);  // GET /books/:id
router.put('/:id', bookController.updateBook);   // PUT /books/:id
router.delete('/:id', bookController.deleteBook);// DELETE /books/:id
router.get('/:id/copies', bookController.getBookCopies);
router.post('/upload-cover', upload.single('file'), bookController.uploadCover);

module.exports = router;
