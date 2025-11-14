import api from './api';

const notificationService = {
    getNotifications: async () => {
        try {
            const response = await api.get('/notifications');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    markAsViewed: async (notificationId) => {
        try {
            const response = await api.put(`/notifications/${notificationId}/view`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    markAllAsRead: async () => {
        try {
            const response = await api.put('/notifications/mark-all-read');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    }
};

export default notificationService;
