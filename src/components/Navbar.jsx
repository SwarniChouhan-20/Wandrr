import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar-modern">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Wandrr Logo" className="logo-image" />
          
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links-modern">
          
        </ul>

        {/* Auth Section */}
<div className="auth-section">
  {user ? (
    <>
      

      <Link to="/" className="btn-logout">Home</Link>
      <Link to="/about" className="btn-logout">About Us</Link>

      <div className="btn-logout">
        <User className="user-icon" />
        <span className="user-name-modern">{user.name}</span>
      </div>

      <button className="btn-logout" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/" className="btn-logout">Home</Link>
      <Link to="/about" className="btn-logout">About Us</Link>

      <Link to="/login">
        <button className="btn-logout">Login</button>
      </Link>
      <Link to="/signup">
        <button className="btn-logout">Sign Up</button>
      </Link>
    </>
  )}
</div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={toggleMenu}>Home</Link>
          <Link to="/plan-trip" className="mobile-link" onClick={toggleMenu}>Plan Trip</Link>
          <Link to="/discover" className="mobile-link" onClick={toggleMenu}>Discover</Link>
          <Link to="/about" className="mobile-link" onClick={toggleMenu}>About Us</Link>
          
          <div className="mobile-auth">
            {user ? (
              <>
                <div className="mobile-user-info">
                  <User size={20} />
                  <span>{user.name}</span>
                </div>
                <button className="mobile-logout" onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}>
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu}>
                  <button className="mobile-login">Login</button>
                </Link>
                <Link to="/signup" onClick={toggleMenu}>
                  <button className="mobile-signup">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}