// src/api/borrowers.js
import { apiCall } from './utils';

export const getAllBorrowers = async () => {
    return apiCall('/api/borrowers', 'GET');
};

export const getBorrowerById = async (id) => {
    return apiCall(`/api/borrowers/${id}`, 'GET');
};

export const addBorrower = async (borrowerData) => {
    return apiCall('/api/borrowers', 'POST', borrowerData);
};

export const updateBorrower = async (id, borrowerData) => {
    return apiCall(`/api/borrowers/${id}`, 'PUT', borrowerData);
};

export const deleteBorrower = async (id) => {
    return apiCall(`/api/borrowers/${id}`, 'DELETE');
};