// src/api/books.js
import { apiCall } from './utils';

export const getAllBooks = async () => {
    return apiCall('/api/books', 'GET');
};

export const getBookById = async (id) => {
    return apiCall(`/api/books/${id}`, 'GET');
};

export const addBook = async (bookData) => {
    return apiCall('/api/books', 'POST', bookData);
};

export const updateBook = async (id, bookData) => {
    return apiCall(`/api/books/${id}`, 'PUT', bookData);
};

export const deleteBook = async (id) => {
    return apiCall(`/api/books/${id}`, 'DELETE');
};