import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AdminDashboard from '../components/AdminDashboard';
import BusManagement from '../components/BusManagement';

function Users() {
  return (
    <div className="card">
      <h3>Users</h3>
      <p>User management functionality will be implemented here.</p>
      <p>This will include user verification, subsidy eligibility, and account management.</p>
    </div>
  );
}

function Settings() {
  return (
    <div className="card">
      <h3>Settings</h3>
      <p>System settings and configuration options.</p>
      <p>This will include API configuration, system parameters, and admin preferences.</p>
    </div>
  );
}

function Reports() {
  return (
    <div className="card">
      <h3>Reports</h3>
      <p>Revenue reports, utilization reports, and compliance reports will be available here.</p>
      <p>Generate detailed analytics and export data for further analysis.</p>
    </div>
  );
}

function Routes_() {
  return (
    <div className="card">
      <h3>Route Management</h3>
      <p>Create and manage bus routes, stations, and schedules.</p>
      <p>Assign buses to routes and optimize route efficiency.</p>
    </div>
  );
}

function Subsidies() {
  return (
    <div className="card">
      <h3>Subsidy Management</h3>
      <p>Manage subsidy schemes, eligibility criteria, and budget allocation.</p>
      <p>Track subsidy utilization and generate subsidy reports.</p>
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
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/buses" element={<BusManagement />} />
          <Route path="/routes" element={<Routes_ />} />
          <Route path="/users" element={<Users />} />
          <Route path="/subsidies" element={<Subsidies />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
