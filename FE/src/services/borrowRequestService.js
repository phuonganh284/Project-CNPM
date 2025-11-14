import api from './api';

const borrowRequestService = {
    getReaderRequests: async () => {
        try {
            const response = await api.get('/borrow-requests/my-requests');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    cancelRequest: async (requestId) => {
        try {
            const response = await api.delete(`/borrow-requests/${requestId}/cancel`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    // Add other borrow-request related functions for librarian if needed
    getAllRequests: async () => {
        try {
            const response = await api.get('/borrow-requests');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    approveRequest: async (requestId) => {
        try {
            const response = await api.put(`/borrow-requests/${requestId}/approve`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    rejectRequest: async (requestId, rejectionReason) => {
        try {
            const response = await api.delete(`/borrow-requests/${requestId}/reject`, {
                data: { rejection_reason: rejectionReason }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    getApprovedRequests: async () => {
        try {
            // Assuming the backend supports filtering by status
            const response = await api.get('/borrow-requests/approved');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    },

    createRequest: async (requestData) => {
        try {
            const response = await api.post('/borrow-requests', requestData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || error.message;
        }
    }
};

export default borrowRequestService;
