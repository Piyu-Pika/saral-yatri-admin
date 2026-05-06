import React, { useState } from 'react';

const defaultAlerts = [
  { key: 'lowFleetUtilization', label: 'Low Fleet Utilization', enabled: true },
  { key: 'highCrowd', label: 'High Crowd Alert', enabled: true },
  { key: 'routeDeviation', label: 'Route Deviation Alert', enabled: true },
  { key: 'lateDeparture', label: 'Late Departure Alert', enabled: false }
];

const dummyTasks = [
  { title: 'Approve extra buses for festival route', owner: 'Transit Ops', priority: 'High', due: 'Today' },
  { title: 'Review conductor compliance report', owner: 'Admin Desk', priority: 'Medium', due: 'Tomorrow' },
  { title: 'Verify GPS health for depot D-3', owner: 'IoT Team', priority: 'Low', due: '2 days' }
];

export default function AdminControlCenter() {
  const [alerts, setAlerts] = useState(defaultAlerts);
  const [notice, setNotice] = useState('');

  const toggleAlert = (key) => {
    setAlerts((prev) => prev.map((a) => (a.key === key ? { ...a, enabled: !a.enabled } : a)));
  };

  const savePreferences = () => {
    localStorage.setItem('adminControlAlerts', JSON.stringify(alerts));
    setNotice('Preferences saved locally (dummy).');
    setTimeout(() => setNotice(''), 2500);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Control Center</h2>
      <p style={{ color: '#5f6368', marginTop: 4 }}>
        A practical admin tab for daily operations, escalations, and quick policy controls.
      </p>

      {notice && <div className="success">{notice}</div>}

      <div className="admin-center-grid">
        <section className="card">
          <h3 style={{ marginTop: 0 }}>Operational Checklist</h3>
          <ul className="plain-list">
            <li>Morning depot readiness check completed</li>
            <li>Peak-hour route balancing pending confirmation</li>
            <li>Token audit sync due at 18:00</li>
            <li>Fuel variance report auto-publish enabled</li>
          </ul>
        </section>

        <section className="card">
          <h3 style={{ marginTop: 0 }}>Smart Alerts</h3>
          <div className="alert-switch-list">
            {alerts.map((alert) => (
              <label key={alert.key} className="alert-switch-item">
                <span>{alert.label}</span>
                <input
                  type="checkbox"
                  checked={alert.enabled}
                  onChange={() => toggleAlert(alert.key)}
                />
              </label>
            ))}
          </div>
          <button className="btn" onClick={savePreferences} style={{ marginTop: 12 }}>
            Save Alert Preferences
          </button>
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Escalation Queue (Dummy)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f7fb' }}>
                <th style={{ textAlign: 'left', padding: 10 }}>Task</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Owner</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Priority</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Due</th>
              </tr>
            </thead>
            <tbody>
              {dummyTasks.map((task) => (
                <tr key={task.title} style={{ borderTop: '1px solid #e0e0e0' }}>
                  <td style={{ padding: 10 }}>{task.title}</td>
                  <td style={{ padding: 10 }}>{task.owner}</td>
                  <td style={{ padding: 10 }}>{task.priority}</td>
                  <td style={{ padding: 10 }}>{task.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
