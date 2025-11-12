import api from './api';

export const getBooks = async (search = '', filter = 'All') => {
  try {
    const response = await api.get('/books', {
      params: { search, filter }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with id ${id}:`, error);
    throw error;
  }
};
