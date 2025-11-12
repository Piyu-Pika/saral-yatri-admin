import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';

const Settings = () => {
  const [settings, setSettings] = useState({
    system_name: 'Saral Yatri',
    base_fare: 10,
    fare_per_km: 1.5,
    max_subsidy_percentage: 50,
    ticket_validity_hours: 24,
    maintenance_interval_days: 30,
    compliance_check_days: 7,
  });
  const [originalSettings, setOriginalSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const { loading, error, execute } = useApi();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, originalSettings]);

  const loadSettings = async () => {
    try {
      const response = await execute(() => AdminService.getSystemSettings());
      setSettings(response.data);
      setOriginalSettings(response.data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSave = async () => {
    try {
      await execute(() => AdminService.updateSystemSettings(settings));
      setOriginalSettings(settings);
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>System Settings</h2>

      {error && (
        <div className="error">{error}</div>
      )}

      {successMessage && (
        <div className="success">{successMessage}</div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>General Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
          <div>
            <label>System Name</label>
            <input
              type="text"
              value={settings.system_name}
              onChange={(e) => setSettings({...settings, system_name: e.target.value})}
              style={{ width: '100%', padding: '8px 12px' }}
            />
          </div>
          
          <div>
            <label>Ticket Validity (hours)</label>
            <input
              type="number"
              value={settings.ticket_validity_hours}
              onChange={(e) => setSettings({...settings, ticket_validity_hours: parseInt(e.target.value)})}
              min="1"
              style={{ width: '100%', padding: '8px 12px' }}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Fare Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
          <div>
            <label>Base Fare (₹)</label>
            <input
              type="number"
              value={settings.base_fare}
              onChange={(e) => setSettings({...settings, base_fare: parseFloat(e.target.value)})}
              min="0"
              step="0.5"
              style={{ width: '100%', padding: '8px 12px' }}
            />
          </div>
          
          <div>
            <label>Fare per KM (₹)</label>
            <input
              type="number"
              value={settings.fare_per_km}
              onChange={(e) => setSettings({...settings, fare_per_km: parseFloat(e.target.value)})}
              min="0"
              step="0.1"
              style={{ width: '100%', padding: '8px 12px' }}
            />
          </div>
        </div>
        
        <div>
          <label>Maximum Subsidy Percentage (%)</label>
          <input
            type="number"
            value={settings.max_subsidy_percentage}
            onChange={(e) => setSettings({...settings, max_subsidy_percentage: parseFloat(e.target.value)})}
            min="0"
            max="100"
            style={{ width: '100%', padding: '8px 12px' }}
          />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Maintenance & Compliance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <div>
            <label>Maintenance Interval (days)</label>
            <input
              type="number"
              value={settings.maintenance_interval_days}
              onChange={(e) => setSettings({...settings, maintenance_interval_days: parseInt(e.target.value)})}
              min="1"
              style={{ width: '100%', padding: '8px 12px' }}
            />
          </div>
          
          <div>
            <label>Compliance Check Interval (days)</label>
            <input
              type="number"
              value={settings.compliance_check_days}
              onChange={(e) => setSettings({...settings, compliance_check_days: parseInt(e.target.value)})}
              min="1"
              style={{ width: '100%', padding: '8px 12px' }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 15 }}>
        <button 
          className="btn"
          onClick={handleSave}
          disabled={!hasChanges || loading}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={!hasChanges}
        >
          Reset Changes
        </button>
      </div>

      {hasChanges && (
        <div className="warning" style={{ marginTop: 20 }}>
          You have unsaved changes. Click "Save Settings" to apply them.
        </div>
      )}
    </div>
  );
};

export default Settings;
