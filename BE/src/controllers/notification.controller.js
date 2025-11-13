const Notification = require('../models/notification.model');
const { formatResponse, formatError } = require('../utils/responseFormatter');

class NotificationController {
  static async getNotifications(req, res) {
    try {
      const user_id = req.user.id;
      if (!user_id) {
        return res.status(401).json(formatError('Unauthorized', 'User ID not found in token', 401));
      }

      const notifications = await Notification.findByUserId(user_id);
      
      return res.status(200).json(
        formatResponse(notifications, 'Notifications retrieved successfully')
      );

    } catch (error) {
      console.error('Error getting notifications:', error);
      return res.status(500).json(
        formatError('Internal server error', 'Failed to retrieve notifications')
      );
    }
  }

  static async markAsRead(req, res) {
    try {
      const user_id = req.user.id;
      const notification_id = parseInt(req.params.id);

      if (isNaN(notification_id)) {
        return res.status(400).json(formatError('Invalid ID', 'Notification ID must be a number', 400));
      }

      const notification = await Notification.markAsRead(notification_id, user_id);

      return res.status(200).json(
        formatResponse(notification, 'Notification marked as read')
      );

    } catch (error) {
      console.error('Error marking notification as read:', error);
      if (error.message.includes('not found')) {
        return res.status(404).json(formatError('Not Found', error.message, 404));
      }
      return res.status(500).json(
        formatError('Internal server error', 'Failed to mark notification as read')
      );
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const user_id = req.user.id;
      const count = await Notification.markAllAsRead(user_id);

      return res.status(200).json(
        formatResponse({ count }, `${count} notifications marked as read`)
      );

    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return res.status(500).json(
        formatError('Internal server error', 'Failed to mark all notifications as read')
      );
    }
  }
}

module.exports = NotificationController;
