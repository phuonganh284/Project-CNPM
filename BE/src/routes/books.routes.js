const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');
const { optionalAuthenticateToken } = require('../middleware/auth');

router.get('/', optionalAuthenticateToken, booksController.getBooks);
router.get('/:id', booksController.getBookById);

module.exports = router;
