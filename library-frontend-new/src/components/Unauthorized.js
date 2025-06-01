// src/components/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-red-50 text-red-800 p-6 rounded-lg shadow-lg max-w-md mx-auto my-8">
      <h2 className="text-4xl font-bold mb-4">Access Denied!</h2>
      <p className="text-lg mb-6 text-center">
        
      </p>
      <div className="flex space-x-4">
        <Link
          to="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-md"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/login"
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-md"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;