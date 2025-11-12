import api from './api';

// Fetch all categories
export const getCategories = async () => {
    try {
        const res = await api.get('/categories');
        // Backend may return { success, data } or raw array — normalize to array
        if (res.data && Array.isArray(res.data.data)) return res.data.data;
        if (Array.isArray(res.data)) return res.data;
        return [];
    } catch (err) {
        console.error('Error fetching categories:', err);
        throw err;
    }
};

// Add a new category
export const createCategory = async (category_name) => {
    try {
        const res = await api.post('/categories', { category_name });
        return res.data && res.data.data ? res.data.data : res.data;
    } catch (err) {
        console.error('Error creating category:', err);
        throw err;
    }
};

// Delete a category by ID
export const deleteCategory = async (id) => {
    try {
        const res = await api.delete(`/categories/${id}`);
        return res.data && res.data.data ? res.data.data : res.data;
    } catch (err) {
        console.error(`Error deleting category ${id}:`, err);
        throw err;
    }
};
