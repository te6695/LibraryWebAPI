// src/components/ProtectedRoute.js
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    console.log("ProtectedRoute initial render: User:", user, "Loading:", loading, "Required Role:", requiredRole);

    useEffect(() => {
        console.log("ProtectedRoute useEffect: User:", user, "Loading:", loading);

        if (loading) {
            console.log("ProtectedRoute useEffect: Still loading auth state. Waiting...");
            return; // Do nothing, let AuthProvider handle initial loading screen
        }

        // After loading is false, check user status
        if (!user) {
            console.log("ProtectedRoute useEffect: Loading finished, but no user. Redirecting to login.");
            navigate('/login', { replace: true });
            return;
        }

        // Check role if required
        if (requiredRole && user.role !== requiredRole) {
            console.log(`ProtectedRoute useEffect: User role '${user.role}' does not match required role '${requiredRole}'. Redirecting to unauthorized.`);
            navigate('/unauthorized', { replace: true });
            return;
        }

        console.log("ProtectedRoute useEffect: User authenticated and authorized. Access granted.");
    }, [user, loading, requiredRole, navigate]); // Dependencies for useEffect

    // Render children only if user is present AND not loading AND roles match
    // The useEffect handles the redirection, so this just renders the content
    // after the checks pass.
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-700">Checking authentication...</div>
            </div>
        );
    }

    if (user && (!requiredRole || user.role === requiredRole)) {
        return children;
    }

    // Fallback: If not loading, but no user or role mismatch, the useEffect should have redirected.
    // This case should ideally not be reached if useEffect handles all redirections.
    return null;
};

export default ProtectedRoute;