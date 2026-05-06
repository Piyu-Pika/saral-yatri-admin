import React from 'react';

export default function Header({ title }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="header">
      <div>
        <h1 className="page-title">{title || 'Dashboard'}</h1>
        <p className="page-subtitle">Smart transport operations dashboard</p>
      </div>
      <div className="header-meta">
        <strong>Welcome, Admin</strong>
        <span>{today}</span>
      </div>
    </div>
  );
}
