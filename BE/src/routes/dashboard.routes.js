const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

/**
 * @route   GET /api/dashboard
 * @desc    Get all dashboard data (stats + recent activities + popular books)
 * @access  Librarian only
 */
router.get('/',
  authenticateToken,
  authorizeRole('librarian'),
  DashboardController.getDashboard
);

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics only
 * @access  Librarian only
 */
router.get('/stats',
  authenticateToken,
  authorizeRole('librarian'),
  DashboardController.getStats
);

/**
 * @route   GET /api/dashboard/recent-activities
 * @desc    Get recent activities
 * @access  Librarian only
 * @query   limit (default 10)
 */
router.get('/recent-activities',
  authenticateToken,
  authorizeRole('librarian'),
  DashboardController.getRecentActivities
);

/**
 * @route   GET /api/dashboard/popular-books
 * @desc    Get most borrowed books
 * @access  Librarian only
 * @query   limit (default 10)
 */
router.get('/popular-books',
  authenticateToken,
  authorizeRole('librarian'),
  DashboardController.getPopularBooks
);

module.exports = router;
