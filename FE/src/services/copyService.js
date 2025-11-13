import api from './api';

// Get all copies for a specific book
export const getCopiesByBook = async (bookId) => {
    try {
        const res = await api.get(`/copies/${bookId}`);
        // normalize response
        return Array.isArray(res.data) ? res.data : res.data?.data || [];
    } catch (err) {
        console.error(`Error fetching copies for book ${bookId}:`, err);
        throw err;
    }
};

// Add a copy to a book
export const addCopy = async (bookId) => {
    try {
        const res = await api.post(`/copies/book/${bookId}`, { book_id: Number(bookId) });
        return res.data;
    } catch (err) {
        console.error(`Error adding copy for book ${bookId}:`, err);
        throw err;
    }
};

// Delete a copy by copy ID
export const deleteCopy = async (copyId) => {
    try {
        const res = await api.delete(`/copies/${copyId}`);
        return res.data;
    } catch (err) {
        console.error(`Error deleting copy ${copyId}:`, err);
        throw err;
    }
};
