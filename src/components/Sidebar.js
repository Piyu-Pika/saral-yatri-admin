import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleLogout() {
    if (onLogout) onLogout();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: 20 }}>
        <h2>Transport Admin</h2>
        {user && (
          <div style={{ fontSize: 12, color: '#666' }}>
            Welcome, {user.username}
          </div>
        )}
      </div>

      <nav>
        <NavLink className="nav-link" to="/">
          Dashboard
        </NavLink>
        <NavLink className="nav-link" to="/buses">
          Buses
        </NavLink>
        <NavLink className="nav-link" to="/routes">
          Routes
        </NavLink>
        <NavLink className="nav-link" to="/stations">
          Stations
        </NavLink>
        <NavLink className="nav-link" to="/conductors">
          Conductors
        </NavLink>
        <NavLink className="nav-link" to="/users">
          Users
        </NavLink>
        <NavLink className="nav-link" to="/subsidies">
          Subsidies
        </NavLink>
        <NavLink className="nav-link" to="/reports">
          Reports
        </NavLink>
        <NavLink className="nav-link" to="/iot">
          IoT Monitoring
        </NavLink>
        <NavLink className="nav-link" to="/admin-control">
          Admin Control
        </NavLink>
        <NavLink className="nav-link" to="/settings">
          Settings
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <button className="btn" onClick={handleLogout} style={{ width: '100%' }}>
          Logout
        </button>
      </div>
    </aside>
  );
}
