import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handlePlanTripClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (token) {
      // User is logged in, go to plan-trip page
      navigate('/plan-trip');
    } else {
      // User is not logged in, redirect to login
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">🌍 Wandrr</div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li>
          <a href="/plan-trip" onClick={handlePlanTripClick}>
            Plan Trip
          </a>
        </li>
        <li><Link to="/discover">Discover</Link></li>
        <li><Link to="/discover">About Us</Link></li>
      </ul>

      <div className="auth-buttons">
        {user ? (
          // Show user name and logout button when logged in
          <>
            <span className="user-name">👋 {user.name}</span>
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          // Show login and signup buttons when not logged in
          <>
            <Link to="/login">
              <button className="login">Login</button>
            </Link>
            <Link to="/signup">
              <button className="signup">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}