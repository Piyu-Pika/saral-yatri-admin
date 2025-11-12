import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AdminDashboard from '../components/AdminDashboard';
import BusManagement from '../components/BusManagement';
import UserManagement from './UserManagement';
import RouteManagement from './RouteManagement';
import SubsidyManagement from './SubsidyManagement';
import Reports from './Reports';
import Settings from './Settings';

export default function Home({ onLogout }) {
  return (
    <div className="admin-root">
      <Sidebar onLogout={onLogout} />
      <main className="content">
        <Header />
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/buses" element={<BusManagement />} />
          <Route path="/routes" element={<RouteManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/subsidies" element={<SubsidyManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
