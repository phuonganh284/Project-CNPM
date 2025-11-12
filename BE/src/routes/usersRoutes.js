const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Admin endpoints for users management
router.get('/', usersController.getAllUsersAdmin);
router.get('/:id', usersController.getUserByIdAdmin);
router.put('/:id', usersController.updateUserAdmin);

module.exports = router;
