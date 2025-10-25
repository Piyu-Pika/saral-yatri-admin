import React from 'react';

export default function Header({ title }) {
  return (
    <div className="header">
      <h1 style={{ margin: 0, fontSize: 20 }}>{title || 'Dashboard'}</h1>
      <div style={{ color: '#334155' }}>Welcome, Admin</div>
    </div>
  );
}
