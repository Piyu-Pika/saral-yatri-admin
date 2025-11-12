import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';
import { formatCurrency, formatNumber } from '../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = async () => {
    try {
      const response = await execute(() => AdminService.getSystemStats());
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      // Set mock data as fallback
      setStats({
        overview: {
          active_buses: 0,
          today_revenue: 0,
          today_tickets: 0,
          today_subsidy: 0,
          active_routes: 0,
          registered_users: 0
        },
        real_time: {
          buses_in_service: 0,
          passengers_served: 0,
          current_occupancy: 0
        },
        compliance: {
          compliant_buses: 0,
          pending_renewals: 0,
          maintenance_due: 0
        },
        generated_at: new Date().toISOString()
      });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ color: '#f44336', marginBottom: 10 }}>
          Error loading dashboard: {error}
        </div>
        <button onClick={loadStats} className="btn">
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: 20 }}>
        <div>No data available</div>
      </div>
    );
  }

  const { overview, real_time, compliance } = stats;

  return (
    <div style={{ padding: 20 }}>
      <h2>System Dashboard</h2>
      
      {/* Overview Stats */}
      <div style={{ marginBottom: 30 }}>
        <h3>System Overview</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 15 
        }}>
          <div className="stat-card">
            <h4>Active Buses</h4>
            <div className="stat-value">{formatNumber(overview.active_buses)}</div>
          </div>
          <div className="stat-card">
            <h4>Today's Revenue</h4>
            <div className="stat-value">{formatCurrency(overview.today_revenue)}</div>
          </div>
          <div className="stat-card">
            <h4>Today's Tickets</h4>
            <div className="stat-value">{formatNumber(overview.today_tickets)}</div>
          </div>
          <div className="stat-card">
            <h4>Today's Subsidy</h4>
            <div className="stat-value">{formatCurrency(overview.today_subsidy)}</div>
          </div>
          <div className="stat-card">
            <h4>Active Routes</h4>
            <div className="stat-value">{formatNumber(overview.active_routes)}</div>
          </div>
          <div className="stat-card">
            <h4>Registered Users</h4>
            <div className="stat-value">{formatNumber(overview.registered_users)}</div>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div style={{ marginBottom: 30 }}>
        <h3>Real-time Status</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 15 
        }}>
          <div className="stat-card">
            <h4>Buses in Service</h4>
            <div className="stat-value">{formatNumber(real_time.buses_in_service)}</div>
          </div>
          <div className="stat-card">
            <h4>Passengers Served</h4>
            <div className="stat-value">{formatNumber(real_time.passengers_served)}</div>
          </div>
          <div className="stat-card">
            <h4>Current Occupancy</h4>
            <div className="stat-value">{real_time.current_occupancy}%</div>
          </div>
        </div>
      </div>

      {/* Compliance Stats */}
      <div style={{ marginBottom: 30 }}>
        <h3>Compliance Status</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 15 
        }}>
          <div className="stat-card" style={{ backgroundColor: '#e8f5e8' }}>
            <h4>Compliant Buses</h4>
            <div className="stat-value" style={{ color: '#4caf50' }}>
              {formatNumber(compliance.compliant_buses)}
            </div>
          </div>
          <div className="stat-card" style={{ backgroundColor: '#fff3e0' }}>
            <h4>Pending Renewals</h4>
            <div className="stat-value" style={{ color: '#ff9800' }}>
              {formatNumber(compliance.pending_renewals)}
            </div>
          </div>
          <div className="stat-card" style={{ backgroundColor: '#ffebee' }}>
            <h4>Maintenance Due</h4>
            <div className="stat-value" style={{ color: '#f44336' }}>
              {formatNumber(compliance.maintenance_due)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
        Last updated: {new Date(stats.generated_at).toLocaleString()}
      </div>
    </div>
  );
};

export default AdminDashboard;