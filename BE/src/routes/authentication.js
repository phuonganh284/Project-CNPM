const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/login', authController.login); // Generic login (backward compatibility)
router.post('/reader/login', authController.loginReader); // Reader specific login
router.post('/librarian/login', authController.loginLibrarian); // Librarian specific login
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPasswordWithToken);
router.post('/request-password-reset', authController.requestPasswordReset); // Deprecated - use forgot-password

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/change-password', authenticateToken, authController.changePasswordWithNotification);

module.exports = router;