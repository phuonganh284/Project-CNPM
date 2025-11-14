const Notification = require('../models/notification.model');
const { formatResponse, formatError } = require('../utils/responseFormatter');
const { pool } = require('../config/database');

// Helper function to format time
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes";
  return Math.floor(seconds) + " seconds";
};

class NotificationController {
  static async getNotifications(req, res) {
    try {
      const user_id = req.user.id;
      if (!user_id) {
        return res.status(401).json(formatError('Unauthorized', 'User ID not found in token', 401));
      }

      // findByUserId now returns the metadata object, thanks to our model refactoring
      const notifications = await Notification.findByUserId(user_id);
      
      // Add a human-readable time difference for frontend convenience
      const formattedNotifications = notifications.map(notif => ({
        ...notif,
        time_ago: formatTimeAgo(notif.created_at)
      }));

      return res.status(200).json(
        formatResponse(formattedNotifications, 'Notifications retrieved successfully')
      );

    } catch (error) {
      console.error('Error getting notifications:', error);
      return res.status(500).json(
        formatError('Internal server error', 'Failed to retrieve notifications')
      );
    }
  }

  static async markAsViewed(req, res) {
    try {
      const user_id = req.user.id;
      const notification_id = parseInt(req.params.id);

      if (isNaN(notification_id)) {
        return res.status(400).json(formatError('Invalid ID', 'Notification ID must be a number', 400));
      }

      // Update the specific notification
      await Notification.markAsViewed(notification_id, user_id);

      // Fetch the fresh, complete list of notifications
      const notifications = await Notification.findByUserId(user_id);
      const formattedNotifications = notifications.map(notif => ({
        ...notif,
        time_ago: formatTimeAgo(notif.created_at)
      }));

      // Return the entire updated list to sync the frontend
      return res.status(200).json(
        formatResponse(formattedNotifications, 'Notification marked as read and list refreshed')
      );

    } catch (error) {
      console.error('Error marking notification as viewed:', error);
      if (error.message.includes('not found')) {
        return res.status(404).json(formatError('Not Found', error.message, 404));
      }
      return res.status(500).json(
        formatError('Internal server error', 'Failed to mark notification as viewed')
      );
    }
  }

  static async markAllAsRead(req, res) {
    try {
      const user_id = req.user.id;
      
      // Update all notifications
      await Notification.markAllAsRead(user_id);

      // Fetch the fresh, complete list of notifications
      const notifications = await Notification.findByUserId(user_id);
      const formattedNotifications = notifications.map(notif => ({
        ...notif,
        time_ago: formatTimeAgo(notif.created_at)
      }));

      // Return the entire updated list to sync the frontend
      return res.status(200).json(
        formatResponse(formattedNotifications, 'All notifications marked as read and list refreshed')
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
