const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');
const bookController = require('../controllers/bookController');
const { optionalAuthenticateToken } = require('../middleware/auth');

router.get('/', optionalAuthenticateToken, booksController.getBooks);
router.get('/:id', optionalAuthenticateToken, booksController.getBookById);



module.exports = router;
