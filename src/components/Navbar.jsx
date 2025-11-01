import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">🌍 Wandrr</div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/plan-trip">Plan Trip</Link></li>
        <li><Link to="/discover">Discover</Link></li>
      </ul>

      <div className="auth-buttons">
        <Link to="/login">
          <button className="login">Login</button>
        </Link>
        <Link to="/signup">
          <button className="signup">Sign Up</button>
        </Link>
      </div>
    </nav>
  );
}
