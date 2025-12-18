import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h2>SkillSync</h2>
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/skills">Skill Extraction</Link></li>
          <li><Link to="/retention">Retention</Link></li>
          <li><Link to="/career">Career</Link></li>
          <li><Link to="/tasks">Tasks</Link></li>
        </ul>

        <div className="navbar-user">
          <span>Hello, {user.name}</span>
          <button onClick={onLogout} className="btn btn-secondary">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;