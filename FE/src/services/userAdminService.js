import api from './api';

export const getUsersAdmin = async () => {
    try {
        const res = await api.get('/users-admin');
        // normalize { success, data } or raw array
        if (res.data && Array.isArray(res.data.data)) return res.data.data;
        if (Array.isArray(res.data)) return res.data;
        return [];
    } catch (err) {
        console.error('Error fetching users (admin):', err);
        throw err;
    }
};

export const getUserByIdAdmin = async (id) => {
    try {
        const res = await api.get(`/users-admin/${id}`);
        // normalize { success, data } or raw object
        if (res.data && res.data.data) return res.data.data;
        if (res.data && typeof res.data === 'object') return res.data;
        return null;
    } catch (err) {
        console.error(`Error fetching user ${id} (admin):`, err);
        throw err;
    }
};

export const updateUserAdmin = async (id, fields) => {
    try {
        const res = await api.put(`/users-admin/${id}`, fields);
        return res.data && res.data.data ? res.data.data : res.data;
    } catch (err) {
        console.error(`Error updating user ${id}:`, err);
        throw err;
    }
};
