import api from './api';

const borrowingService = {
    getReaderBorrowings: async () => {
        try {
            const response = await api.get('/borrowings/my-borrowings');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    renewBorrowing: async (borrowingId, newDueDate) => {
        try {
            const response = await api.put(`/borrowings/${borrowingId}/renew`, { newDueDate });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    requestReturn: async (borrowingId) => {
        try {
            // The backend now defaults the condition, so we can send an empty body.
            const response = await api.post(`/borrowings/${borrowingId}/return-request`, {});
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    confirmPickup: async (borrowingId) => {
        try {
            const response = await api.post(`/borrowings/confirm-delivery/${borrowingId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    getReturnRequests: async () => {
        try {
            const response = await api.get('/borrowings/return-requests');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    assessReturn: async (returnId, assessmentData) => {
        try {
            const response = await api.put(`/borrowings/return-requests/${returnId}/assess`, assessmentData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    confirmReturn: async (returnId) => {
        try {
            const response = await api.post(`/borrowings/return-requests/${returnId}/complete`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    getBorrowingHistory: async () => {
        try {
            const response = await api.get('/borrowings/history');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    getBorrowingHistoryByReader: async (userId) => {
        try {
            const response = await api.get(`/borrowings/history/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    getAllBorrowings: async () => {
        try {
            const response = await api.get('/borrowings?active=true');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    }
};

export default borrowingService;
