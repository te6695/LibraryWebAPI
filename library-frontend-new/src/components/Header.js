// src/components/Header.js
import React, { useContext } from 'react'; // Import useContext
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation for active link styling
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import './Header.css';

function Header() {
  const { user, logout } = useContext(AuthContext); // Get user and logout from context
  const navigate = useNavigate();
  const location = useLocation(); // To get current path for active link styling

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="app-header">
      <Link to="/" className="logo-title">Library App</Link> {/* Your app title/logo */}
      <nav>
        <ul className="nav-list">
          {user && user.username && ( // Only show Dashboard link if logged in
            <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
          )}
          {user && user.role === 'Admin' && ( // Example: Only show admin links for 'Admin' role
            <>
              <li><Link to="/books" className={location.pathname.startsWith('/books') ? 'active' : ''}>Books</Link></li>
              <li><Link to="/borrowers" className={location.pathname.startsWith('/borrowers') ? 'active' : ''}>Borrowers</Link></li>
              <li><Link to="/loans" className={location.pathname.startsWith('/loans') ? 'active' : ''}>Loans</Link></li>
            </>
          )}
          {/* Add other role-based links as needed */}
        </ul>
      </nav>

      <div className="auth-actions">
        {user && user.username ? ( // If user is logged in
          <>
            <span>Hello, {user.username}!</span> {/* Display username */}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : ( // If not logged in
          <>
            <Link to="/login"><button>Login</button></Link>
            <Link to="/register"><button>Register</button></Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;