// src/api/utils.js
import { API_BASE_URL } from './config';

// Helper function to get authenticated headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // In a real app, you might throw an error or redirect to login here
        console.warn("No authentication token found. Request might fail.");
        return { 'Content-Type': 'application/json' };
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

// Generic API call handler
export const apiCall = async (endpoint, method = 'GET', data = null, requiresAuth = true) => {
    const headers = requiresAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
    const config = {
        method,
        headers,
        body: data ? JSON.stringify(data) : null,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            // Attempt to parse error message from backend
            let errorData = {};
            try {
                errorData = await response.json();
            } catch (e) {
                // If response is not JSON, use status text
                errorData.message = response.statusText;
            }
            const errorMessage = errorData.message || `API Error: ${response.status}`;
            throw new Error(errorMessage);
        }

        // Handle cases where no content is returned (e.g., DELETE, PUT with 204 No Content)
        if (response.status === 204) {
            return null;
        }

        return response.json();
    } catch (error) {
        console.error(`Error during API call to ${endpoint}:`, error);
        throw error;
    }
};