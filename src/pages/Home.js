import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AdminDashboard from '../components/AdminDashboard';
import BusManagement from '../components/BusManagement';
import RouteManagement from '../components/RouteManagement';
import StationManagement from '../components/StationManagement';
import ConductorManagement from '../components/ConductorManagement';
import UserManagement from '../components/UserManagement';
import SubsidyManagement from '../components/SubsidyManagement';
import ReportsManagement from '../components/ReportsManagement';

function Settings() {
  const [settings, setSettings] = useState({
    defaultFareOrdinary: 10.00,
    defaultFareAC: 15.00,
    maxSubsidyPercentage: 50,
    ticketValidityHours: 24,
    seniorCitizenDiscount: 50,
    studentDiscount: 25,
    disabledDiscount: 75,
    bplDiscount: 90
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save to localStorage for now
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      defaultFareOrdinary: 10.00,
      defaultFareAC: 15.00,
      maxSubsidyPercentage: 50,
      ticketValidityHours: 24,
      seniorCitizenDiscount: 50,
      studentDiscount: 25,
      disabledDiscount: 75,
      bplDiscount: 90
    };
    setSettings(defaultSettings);
    localStorage.setItem('systemSettings', JSON.stringify(defaultSettings));
  };

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px' }}>
      <h2>Settings</h2>

      {saved && (
        <div style={{ 
          marginTop: 15,
          padding: 10, 
          backgroundColor: '#e8f5e8', 
          color: '#4caf50',
          borderRadius: 4,
          marginBottom: 15
        }}>
          ✓ Settings saved successfully!
        </div>
      )}

      {/* API Configuration */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>API Configuration</h3>
        <p style={{ color: '#666', marginBottom: 20, fontSize: 14 }}>
          Current API endpoint configuration (read-only)
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 15 }}>
          <div>
            <label>API Base URL</label>
            <input 
              type="text" 
              value={process.env.REACT_APP_API_BASE_URL || ''} 
              disabled 
              style={{ width: '100%', backgroundColor: '#f5f5f5' }}
            />
          </div>
          <div>
            <label>Environment</label>
            <input 
              type="text" 
              value={process.env.REACT_APP_ENV || 'development'} 
              disabled 
              style={{ width: '100%', backgroundColor: '#f5f5f5' }}
            />
          </div>
        </div>
      </div>

      {/* Fare Configuration */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Fare Configuration</h3>
        <p style={{ color: '#666', marginBottom: 20, fontSize: 14 }}>
          Set default fare rates for different bus types
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 15 }}>
          <div>
            <label>Default Fare (Ordinary) ₹</label>
            <input 
              type="number" 
              step="0.01"
              value={settings.defaultFareOrdinary}
              onChange={(e) => setSettings({...settings, defaultFareOrdinary: parseFloat(e.target.value)})}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label>Default Fare (AC) ₹</label>
            <input 
              type="number" 
              step="0.01"
              value={settings.defaultFareAC}
              onChange={(e) => setSettings({...settings, defaultFareAC: parseFloat(e.target.value)})}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label>Ticket Validity (hours)</label>
            <input 
              type="number"
              value={settings.ticketValidityHours}
              onChange={(e) => setSettings({...settings, ticketValidityHours: parseInt(e.target.value)})}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Subsidy Configuration */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Subsidy Configuration</h3>
        <p style={{ color: '#666', marginBottom: 20, fontSize: 14 }}>
          Configure discount percentages for different subsidy categories
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 15 }}>
          <div>
            <label>Senior Citizen Discount (%)</label>
            <input 
              type="number"
              min="0"
              max="100"
              value={settings.seniorCitizenDiscount}
              onChange={(e) => setSettings({...settings, seniorCitizenDiscount: parseInt(e.target.value)})}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label>Student Discount (%)</label>
            <input 
              type="number"
              min="0"
              max="100"
              value={settings.studentDiscount}
              onChange={(e) => setSettings({...settings, studentDiscount: parseInt(e.target.value)})}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label>Disabled Person Discount (%)</label>
            <input 
              type="number"
              min="0"
              max="100"
              value={settings.disabledDiscount}
              onChange={(e) => setSettings({...settings, disabledDiscount: parseInt(e.target.value)})}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label>BPL Discount (%)</label>
            <input 
              type="number"
              min="0"
              max="100"
              value={settings.bplDiscount}
              onChange={(e) => setSettings({...settings, bplDiscount: parseInt(e.target.value)})}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label>Max Subsidy Percentage (%)</label>
            <input 
              type="number"
              min="0"
              max="100"
              value={settings.maxSubsidyPercentage}
              onChange={(e) => setSettings({...settings, maxSubsidyPercentage: parseInt(e.target.value)})}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>System Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 15 }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Version</label>
            <p style={{ margin: 0, color: '#666' }}>1.0.0</p>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Last Updated</label>
            <p style={{ margin: 0, color: '#666' }}>{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>System Status</label>
            <p style={{ margin: 0, color: '#4caf50' }}>✓ Operational</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn" onClick={handleSave}>
          Save Settings
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset to Defaults
        </button>
      </div>
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
          <Route path="/routes" element={<RouteManagement />} />
          <Route path="/stations" element={<StationManagement />} />
          <Route path="/conductors" element={<ConductorManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/subsidies" element={<SubsidyManagement />} />
          <Route path="/reports" element={<ReportsManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
