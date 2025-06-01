// src/api/loans.js
import { apiCall } from './utils';

export const issueLoan = async (loanData) => {
    // loanData should contain bookId, borrowerId, dueDate
    return apiCall('/api/loans/issue', 'POST', loanData);
};

export const getAllLoans = async () => {
    return apiCall('/api/loans', 'GET');
};

export const getLoanById = async (id) => {
    return apiCall(`/api/loans/${id}`, 'GET');
};

export const returnLoan = async (id) => {
    return apiCall(`/api/loans/${id}/return`, 'POST'); // Assuming a POST endpoint for return
};

export const getOverdueLoans = async () => {
    return apiCall('/api/loans/overdue', 'GET');
};