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
            const response = await api.put(`/borrowings/${borrowingId}/request-return`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    confirmPickup: async (borrowingId) => {
        try {
            const response = await api.put(`/borrowings/${borrowingId}/confirm-pickup`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    getReturnRequests: async () => {
        try {
            const response = await api.get('/borrowings/return-requests?status=pending');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    assessReturn: async (borrowingId, assessmentData) => {
        try {
            const response = await api.put(`/borrowings/${borrowingId}/assess`, assessmentData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    confirmReturn: async (borrowingId) => {
        try {
            const response = await api.put(`/borrowings/${borrowingId}/confirm-return`);
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
