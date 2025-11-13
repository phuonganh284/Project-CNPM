const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for the authenticated user
 * @access  Private
 */
router.get(
  '/',
  authenticateToken,
  NotificationController.getNotifications
);

/**
 * @route   PUT /api/notifications/mark-all-read
 * @desc    Mark all unread notifications as read
 * @access  Private
 */
router.put(
  '/mark-all-read',
  authenticateToken,
  NotificationController.markAllAsRead
);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a specific notification as read
 * @access  Private
 */
router.put(
  '/:id/read',
  authenticateToken,
  NotificationController.markAsRead
);

module.exports = router;
