import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    if (onLogout) onLogout();
    // Clear local storage flag used by auth stub
    localStorage.removeItem('isAuth');
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <h2>Admin</h2>
      <nav>
        <NavLink className="nav-link" to="/">Dashboard</NavLink>
        <NavLink className="nav-link" to="/users">Users</NavLink>
        <NavLink className="nav-link" to="/settings">Settings</NavLink>
      </nav>

      <div style={{ marginTop: 20 }}>
        <button className="btn" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}
