// src/App.js
import React from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes'; // Import the new AppRoutes component

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes /> {/* Render the AppRoutes component */}
      </div>
    </AuthProvider>
  );
}

export default App;