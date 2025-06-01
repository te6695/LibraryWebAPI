// src/components/Dashboard.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user } = useContext(AuthContext); // Get user from context to display info

  if (!user) {
    // Optionally handle case where user is null (though ProtectedRoute should prevent this)
    return <div className="page-container"><h2>Access Denied</h2><p>Please log in to view the dashboard.</p></div>;
  }

  return (
    <div className="page-container">
      <h2>Welcome to your Dashboard, {user.username}!</h2>
      <p>Your Role: {user.role || 'Not Assigned'}</p> {/* Display user role */}

      <div className="dashboard-grid">
        {/* Books Card */}
        <div className="dashboard-card">
          <h3>Books Management</h3>
          <p>View available books or manage the library's collection.</p>
          <Link to="/books">
            <button className="action-button">View Books</button>
          </Link>
          {user.role === 'Admin' && ( // Example: Only show Manage Books for Admin
            <Link to="/books/manage">
              <button className="action-button" style={{ marginLeft: '10px' }}>Manage Books</button>
            </Link>
          )}
        </div>

        {/* Borrowers Card */}
        {user.role === 'Admin' && ( // Example: Only show Borrowers for Admin
          <div className="dashboard-card">
            <h3>Borrowers Management</h3>
            <p>View registered borrowers or manage borrower details.</p>
            <Link to="/borrowers">
              <button className="action-button">View Borrowers</button>
            </Link>
            <Link to="/borrowers/manage">
              <button className="action-button" style={{ marginLeft: '10px' }}>Manage Borrowers</button>
            </Link>
          </div>
        )}

        {/* Loans Card */}
        {user.role === 'Admin' && ( // Example: Only show Loans for Admin
          <div className="dashboard-card">
            <h3>Loan Management</h3>
            <p>Track book loans, issue new loans, or manage overdue items.</p>
            <Link to="/loans">
              <button className="action-button">View Loans</button>
            </Link>
            <Link to="/loans/issue">
              <button className="action-button" style={{ marginLeft: '10px' }}>Issue Loan</button>
            </Link>
          </div>
        )}

        {/* Add more cards for other sections if needed */}
      </div>
    </div>
  );
}

export default Dashboard;