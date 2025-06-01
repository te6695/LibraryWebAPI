// src/AppRoutes.js (Example structure)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import BookList from './components/books/BookList';
import ManageBooks from './components/books/ManageBooks';
import BorrowerList from './components/borrowers/BorrowerList';
import ManageBorrowers from './components/borrowers/ManageBorrowers';
import LoanList from './components/loans/LoanList';
import IssueLoan from './components/loans/IssueLoan';
import OverdueLoans from './components/loans/OverdueLoans';
import Unauthorized from './components/Unauthorized'; // Make sure this component exists
import { AuthContext } from './context/AuthContext'; // Import AuthContext to get user/loading

function AppRoutes() {
  const { user, loading } = React.useContext(AuthContext); // Access user and loading from context

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading application...</div>
      </div>
    );
  }

  return (
    <Router>
      <Header /> {/* Header is now outside Routes so it's always visible */}
      <main className="main-content"> {/* Wrap content in a main for styling */}
        <Routes>
          <Route path="/" element={<Dashboard />} /> {/* Or a public home page */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes for general authenticated users (e.g., "User" role) */}
          <Route element={<ProtectedRoute requiredRole="User" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<BookList />} /> {/* View all books */}
          </Route>

          {/* Protected Routes for Admin specific functionalities */}
          <Route element={<ProtectedRoute requiredRole="Admin" />}> {/* <--- CHANGE THIS LINE FROM "User" TO "Admin" */}
            <Route path="/books/manage" element={<ManageBooks />} />
            <Route path="/borrowers" element={<BorrowerList />} />
            <Route path="/borrowers/manage" element={<ManageBorrowers />} />
            <Route path="/loans" element={<LoanList />} />
            <Route path="/loans/issue" element={<IssueLoan />} />
            <Route path="/loans/overdue" element={<OverdueLoans />} />
          </Route>

          {/* Add a catch-all route for 404 (optional) */}
          <Route path="*" element={<div className="page-container"><h2>404 Not Found</h2><p>The page you are looking for does not exist.</p></div>} />
        </Routes>
      </main>
    </Router>
  );
}

export default AppRoutes;