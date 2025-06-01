import { API_BASE_URL } from './config';

export const loginUser = async (credentials) => {
    const { username, password } = credentials;

    const response = await fetch(`${API_BASE_URL}/api/Auth/Login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed. Invalid credentials or server error.');
    }

    const data = await response.json();

    if (data && data.token && data.username) {
        // --- TEMPORARY FIX: HARDCODE ROLE FOR TESTING ---
        let userRole = 'User'; // Default role for testing
        if (data.username === 'admin') { // Assign 'Admin' role if username is 'admin'
            userRole = 'Admin';
        }
        // --- END TEMPORARY FIX ---

        return {
            token: data.token,
            user: {
                username: data.username,
                role: userRole // Use the hardcoded/derived role
            }
        };
    } else {
        throw new Error("Login successful, but server response missing expected token or username.");
    }
};

export const registerUser = async (registrationData) => {
    const response = await fetch(`${API_BASE_URL}/api/Auth/Register`, { // Adjust endpoint if needed
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed.');
    }

    const data = await response.json(); // This 'data' object should contain any confirmation/token/user info
    // Similar to login, if register returns a token and user, adapt it here
    if (data && data.token && data.username) {
        return {
            token: data.token,
            user: {
                username: data.username
                // Add other user properties if available in register response
            }
        };
    } else {
        // If register only confirms success, return success message or simple object
        return { message: data.message || 'Registration successful!' };
    }
};