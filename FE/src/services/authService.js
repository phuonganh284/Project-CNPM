import api from './api';

const authService = {
    register: async (userData) => {
        console.log(userData)
        try {
            const response = await api.post('/auth/register', userData);
            if (response.data.success) {
                return { success: true, data: response.data.data };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    },

    verifyEmail: async (token) => {
        try {
            console.log('authService.verifyEmail called with token:', token);
            const response = await api.post('/auth/verify-email', { token });
            console.log('API response:', response);
            console.log('response.data:', response.data);
            console.log('response.data.success:', response.data.success);

            if (response.data.success) {
                return { success: true, data: response.data };
            }
            return {
                success: false,
                error: response.data.message || 'Email verification failed'
            };
        } catch (error) {
            console.error('verifyEmail error:', error);
            console.error('error.response:', error.response);
            console.error('error.response?.data:', error.response?.data);
            return {
                success: false,
                error: error.response?.data?.message || 'Email verification failed'
            };
        }
    },

    // Reader login
    loginReader: async (email, password) => {
        try {
            const response = await api.post('/auth/reader/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                return { success: true, data: response.data.data };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    },

    // Librarian login
    loginLibrarian: async (email, password) => {
        try {
            const response = await api.post('/auth/librarian/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                return { success: true, data: response.data.data };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    },

    // Generic login (backward compatibility)
    login: async (email, password, role) => {
        if (role === 'reader') {
            return authService.loginReader(email, password);
        } else if (role === 'librarian') {
            return authService.loginLibrarian(email, password);
        }
        return { success: false, error: 'Invalid role specified' };
    },

    logout: async () => {
        try {
            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    requestPasswordReset: async (email) => {
        try {
            const response = await api.post('/auth/request-password-reset', { email });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Request failed'
            };
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post('/auth/reset-password', { token, newPassword });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Reset failed'
            };
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('/auth/profile');
            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch profile'
            };
        }
    },

    updateProfile: async (profile) => {
        try {
            const response = await api.put('/auth/profile', profile);
            if (response.data.success) {
                return { success: true, data: response.data.data };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Failed to update profile' };
        }
    },

    changePassword: async (currentPassword, newPassword) => {
        try {
            const response = await api.put('/auth/change-password', {
                currentPassword,
                newPassword
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Password change failed'
            };
        }
    }
};

export default authService;