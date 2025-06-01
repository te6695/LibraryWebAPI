// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react'; // Added useCallback
import { loginUser, registerUser } from '../api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start as true
    const [error, setError] = useState(null); // Add an error state for better feedback

    // This useCallback function is for the initial authentication check
    const checkAuthStatus = useCallback(async () => {
        setLoading(true); // Ensure loading is true before checking storage
        const storedToken = localStorage.getItem('token');
        const storedUserJson = localStorage.getItem('user'); // Rename to be explicit it's JSON string

        if (storedToken && storedUserJson) {
            try {
                // Ensure the storedUserJson is not the string "undefined" or "null"
                if (storedUserJson === "undefined" || storedUserJson === "null") {
                    throw new Error("Stored user data is the string 'undefined' or 'null'.");
                }

                const parsedUser = JSON.parse(storedUserJson);

                // Basic validation for the parsed user object
                if (parsedUser && parsedUser.username) { // Assuming 'username' is a core property
                    setUser(parsedUser);
                    console.log("AuthContext: User loaded from localStorage:", parsedUser);
                } else {
                    console.warn('AuthContext: Stored user data is incomplete or invalid. Clearing storage.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } catch (e) {
                console.error("AuthContext: Failed to parse stored user from localStorage:", e);
                // If parsing fails, clear localStorage to prevent repeated errors
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        } else {
            // No valid token or user data found, so ensure user is null
            setUser(null);
            localStorage.removeItem('token'); // Clean up in case only one is present or invalid
            localStorage.removeItem('user');
        }
        setLoading(false); // Set loading to false *after* all checks are done
        // The console.log here will reflect the state *after* this function run completes
        console.log("AuthContext: Initial auth check complete. Final User (after check):", user, "Final Loading:", false); // user might be null here due to async state update.
    }, []); // Empty dependency array means it's created once

    // useEffect to run checkAuthStatus once on component mount
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]); // Dependency on checkAuthStatus ensures it runs when needed

    const login = async (credentials) => {
        setLoading(true); // Set loading to true during login attempt
        setError(null); // Clear any previous errors

        try {
            // loginUser should return { token: '...', user: { ... } }
            const responseData = await loginUser(credentials); // Renamed `token, user: userData` to `responseData` for clarity

            // *** CRITICAL: Check what `responseData` contains here. Add a console.log below ***
            console.log("AuthContext: Backend response data for login:", responseData);


            // Validate the response from loginUser
            if (responseData && responseData.token && responseData.user) {
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('user', JSON.stringify(responseData.user)); // Store user object as a JSON string

                setUser(responseData.user); // Update React state with the parsed user object
                console.log("AuthContext: Login successful, user state updated to:", responseData.user);
                return true; // Indicate success
            } else {
                const errorMessage = responseData?.message || 'Login failed: Invalid response format from server.';
                setError(errorMessage);
                console.error("AuthContext: Login failed due to unexpected response format:", responseData);
                setUser(null); // Ensure user is null on invalid response
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                throw new Error(errorMessage); // Propagate specific error
            }

        } catch (err) {
            const displayError = err.message || 'An unexpected error occurred during login.';
            setError(displayError);
            console.error("AuthContext: Login failed:", err);
            setUser(null); // Ensure user is null on login failure
            localStorage.removeItem('token'); // Clear any partial/invalid data
            localStorage.removeItem('user');
            throw err; // Re-throw to propagate error to Login.js or calling component
        } finally {
            setLoading(false); // Ensure loading is set to false after login attempt
            // console.log("AuthContext: Login process finished. User (at finally):", user, "Loading (at finally):", false); // user might be slightly outdated here due to async state update
        }
    };

    // Consider adding a registration function here as well, similar to login
    const register = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const responseData = await registerUser(credentials);
            console.log("AuthContext: Backend response data for registration:", responseData);

            if (responseData && responseData.token && responseData.user) {
                 localStorage.setItem('token', responseData.token);
                 localStorage.setItem('user', JSON.stringify(responseData.user));
                 setUser(responseData.user);
                 console.log("AuthContext: Registration successful, user state updated to:", responseData.user);
                 return true;
            } else {
                const errorMessage = responseData?.message || 'Registration failed: Invalid response format from server.';
                setError(errorMessage);
                console.error("AuthContext: Registration failed due to unexpected response format:", responseData);
                throw new Error(errorMessage);
            }
        } catch (err) {
            const displayError = err.message || 'An unexpected error occurred during registration.';
            setError(displayError);
            console.error("AuthContext: Registration failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        // setLoading(false); // No need to set loading here, it's typically instant
        console.log("AuthContext: User logged out.");
    };

    const authContextValue = {
        user,
        loading,
        error, // Provide error state
        login,
        register, // Provide register function
        logout,
    };

    // Render a loading indicator while checking initial auth status
    if (loading) {
        console.log("AuthContext: Still loading, rendering loading screen.");
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-700">Loading application...</div>
            </div>
        );
    }

    // If loading is false, then we have a definitive user state (either null or logged in)
    console.log("AuthContext: Loading complete, rendering children. User:", user);
    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};