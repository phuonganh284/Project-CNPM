// src/services/bookAdminService.js
import api from './api';

export const getBooksAdmin = async () => {
    try {
        const response = await api.get('/books-admin');
        // Normalize responses from backend which may wrap data in { success, data }
        return response.data && response.data.data ? response.data.data : response.data;
    } catch (error) {
        console.error('Error fetching books (admin):', error);
        throw error;
    }
};

export const getBookByIdAdmin = async (id) => {
    try {
        const response = await api.get(`/books-admin/${id}`);
        return response.data && response.data.data ? response.data.data : response.data;
    } catch (error) {
        console.error(`Error fetching book ${id} (admin):`, error);
        throw error;
    }
};

export const createBookAdmin = async (book) => {
    try {
        const response = await api.post('/books-admin', book);
        return response.data && response.data.data ? response.data.data : response.data;
    } catch (error) {
        console.error('Error creating book (admin):', error);
        throw error;
    }
};

export const updateBookAdmin = async (bookId, book) => {
    try {
        const response = await api.put(`/books-admin/${bookId}`, book);
        return response.data && response.data.data ? response.data.data : response.data;
    } catch (error) {
        console.error(`Error updating book ${bookId} (admin):`, error);
        throw error;
    }
};

export const deleteBookAdmin = async (bookId) => {
    try {
        const response = await api.delete(`/books-admin/${bookId}`);
        return response.data && response.data.data ? response.data.data : response.data;
    } catch (error) {
        console.error(`Error deleting book ${bookId} (admin):`, error);
        throw error;
    }
};

export const getBookCopiesAdmin = async (bookId) => {
    try {
        const response = await api.get(`/books-admin/${bookId}/copies`);
        return response.data && response.data.data ? response.data.data : response.data;
    } catch (error) {
        console.error(`Error fetching copies for book ${bookId} (admin):`, error);
        throw error;
    }
};
