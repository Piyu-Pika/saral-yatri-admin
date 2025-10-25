import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Dashboard() {
  return (
    <div className="card">
      <h3>Overview</h3>
      <p>This is a small boilerplate dashboard area. Replace with real widgets.</p>
    </div>
  );
}

function Users() {
  return (
    <div className="card">
      <h3>Users</h3>
      <p>List users here.</p>
    </div>
  );
}

function Settings() {
  return (
    <div className="card">
      <h3>Settings</h3>
      <p>App settings form goes here.</p>
    </div>
  );
}

export default function Home({ onLogout }) {
  return (
    <div className="admin-root">
      <Sidebar onLogout={onLogout} />
      <main className="content">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
