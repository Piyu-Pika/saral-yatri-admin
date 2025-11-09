import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';
import { formatCurrency, formatNumber } from '../utils/helpers';

const ReportsManagement = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [revenueReport, setRevenueReport] = useState(null);
  const [utilizationReport, setUtilizationReport] = useState(null);
  const [complianceReport, setComplianceReport] = useState(null);
  const [reportParams, setReportParams] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    group_by: 'day'
  });
  const { loading, error, execute } = useApi();

  const loadRevenueReport = async () => {
    try {
      const response = await execute(() => AdminService.getRevenueReport(reportParams));
      setRevenueReport(response.data);
    } catch (err) {
      console.error('Failed to load revenue report:', err);
      setRevenueReport(null);
    }
  };

  const loadUtilizationReport = async () => {
    try {
      const response = await execute(() => AdminService.getBusUtilizationReport(reportParams));
      setUtilizationReport(response.data);
    } catch (err) {
      console.error('Failed to load utilization report:', err);
      setUtilizationReport(null);
    }
  };

  const loadComplianceReport = async () => {
    try {
      const response = await execute(() => AdminService.getComplianceReport());
      setComplianceReport(response.data);
    } catch (err) {
      console.error('Failed to load compliance report:', err);
      setComplianceReport(null);
    }
  };

  const RevenueReportTab = () => (
    <div>
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Revenue Report Parameters</h3>
        <div style={{ display: 'flex', gap: 15, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label>Start Date</label>
            <input
              type="date"
              value={reportParams.start_date}
              onChange={(e) => setReportParams({...reportParams, start_date: e.target.value})}
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              value={reportParams.end_date}
              onChange={(e) => setReportParams({...reportParams, end_date: e.target.value})}
            />
          </div>
          <div>
            <label>Group By</label>
            <select
              value={reportParams.group_by}
              onChange={(e) => setReportParams({...reportParams, group_by: e.target.value})}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <button className="btn" onClick={loadRevenueReport} disabled={loading}>
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {revenueReport && (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 15,
            marginBottom: 20
          }}>
            <div className="stat-card">
              <h4>Total Revenue</h4>
              <div className="stat-value">{formatCurrency(revenueReport.total_revenue || 0)}</div>
            </div>
            <div className="stat-card">
              <h4>Total Tickets</h4>
              <div className="stat-value">{formatNumber(revenueReport.total_tickets || 0)}</div>
            </div>
            <div className="stat-card">
              <h4>Average Fare</h4>
              <div className="stat-value">{formatCurrency(revenueReport.average_fare || 0)}</div>
            </div>
            <div className="stat-card">
              <h4>Subsidy Amount</h4>
              <div className="stat-value">{formatCurrency(revenueReport.total_subsidy || 0)}</div>
            </div>
          </div>

          {revenueReport.breakdown && revenueReport.breakdown.length > 0 && (
            <div className="card">
              <h3>Revenue Breakdown</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Period</th>
                      <th style={{ padding: 10, textAlign: 'right', borderBottom: '2px solid #ddd' }}>Revenue</th>
                      <th style={{ padding: 10, textAlign: 'right', borderBottom: '2px solid #ddd' }}>Tickets</th>
                      <th style={{ padding: 10, textAlign: 'right', borderBottom: '2px solid #ddd' }}>Avg Fare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueReport.breakdown.map((item, index) => (
                      <tr key={index}>
                        <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{item.period}</td>
                        <td style={{ padding: 10, textAlign: 'right', borderBottom: '1px solid #eee' }}>
                          {formatCurrency(item.revenue)}
                        </td>
                        <td style={{ padding: 10, textAlign: 'right', borderBottom: '1px solid #eee' }}>
                          {formatNumber(item.tickets)}
                        </td>
                        <td style={{ padding: 10, textAlign: 'right', borderBottom: '1px solid #eee' }}>
                          {formatCurrency(item.average_fare)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const UtilizationReportTab = () => (
    <div>
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Bus Utilization Report Parameters</h3>
        <div style={{ display: 'flex', gap: 15, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label>Start Date</label>
            <input
              type="date"
              value={reportParams.start_date}
              onChange={(e) => setReportParams({...reportParams, start_date: e.target.value})}
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              value={reportParams.end_date}
              onChange={(e) => setReportParams({...reportParams, end_date: e.target.value})}
            />
          </div>
          <button className="btn" onClick={loadUtilizationReport} disabled={loading}>
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {utilizationReport && (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 15,
            marginBottom: 20
          }}>
            <div className="stat-card">
              <h4>Average Occupancy</h4>
              <div className="stat-value">{utilizationReport.average_occupancy || 0}%</div>
            </div>
            <div className="stat-card">
              <h4>Total Trips</h4>
              <div className="stat-value">{formatNumber(utilizationReport.total_trips || 0)}</div>
            </div>
            <div className="stat-card">
              <h4>Total Distance</h4>
              <div className="stat-value">{formatNumber(utilizationReport.total_distance_km || 0)} km</div>
            </div>
            <div className="stat-card">
              <h4>Passengers Served</h4>
              <div className="stat-value">{formatNumber(utilizationReport.total_passengers || 0)}</div>
            </div>
          </div>

          {utilizationReport.bus_wise && utilizationReport.bus_wise.length > 0 && (
            <div className="card">
              <h3>Bus-wise Utilization</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Bus Number</th>
                      <th style={{ padding: 10, textAlign: 'right', borderBottom: '2px solid #ddd' }}>Trips</th>
                      <th style={{ padding: 10, textAlign: 'right', borderBottom: '2px solid #ddd' }}>Occupancy</th>
                      <th style={{ padding: 10, textAlign: 'right', borderBottom: '2px solid #ddd' }}>Distance</th>
                      <th style={{ padding: 10, textAlign: 'right', borderBottom: '2px solid #ddd' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utilizationReport.bus_wise.map((bus, index) => (
                      <tr key={index}>
                        <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{bus.bus_number}</td>
                        <td style={{ padding: 10, textAlign: 'right', borderBottom: '1px solid #eee' }}>
                          {formatNumber(bus.trips)}
                        </td>
                        <td style={{ padding: 10, textAlign: 'right', borderBottom: '1px solid #eee' }}>
                          {bus.occupancy}%
                        </td>
                        <td style={{ padding: 10, textAlign: 'right', borderBottom: '1px solid #eee' }}>
                          {formatNumber(bus.distance_km)} km
                        </td>
                        <td style={{ padding: 10, textAlign: 'right', borderBottom: '1px solid #eee' }}>
                          {formatCurrency(bus.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const ComplianceReportTab = () => (
    <div>
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Compliance Report</h3>
        <button className="btn" onClick={loadComplianceReport} disabled={loading}>
          {loading ? 'Loading...' : 'Generate Report'}
        </button>
      </div>

      {complianceReport && (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 15,
            marginBottom: 20
          }}>
            <div className="stat-card" style={{ backgroundColor: '#e8f5e8' }}>
              <h4>Compliant Buses</h4>
              <div className="stat-value" style={{ color: '#4caf50' }}>
                {formatNumber(complianceReport.compliant_buses || 0)}
              </div>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#fff3e0' }}>
              <h4>Pending Renewals</h4>
              <div className="stat-value" style={{ color: '#ff9800' }}>
                {formatNumber(complianceReport.pending_renewals || 0)}
              </div>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#ffebee' }}>
              <h4>Maintenance Due</h4>
              <div className="stat-value" style={{ color: '#f44336' }}>
                {formatNumber(complianceReport.maintenance_due || 0)}
              </div>
            </div>
            <div className="stat-card">
              <h4>Compliance Rate</h4>
              <div className="stat-value">{complianceReport.compliance_rate || 0}%</div>
            </div>
          </div>

          {complianceReport.issues && complianceReport.issues.length > 0 && (
            <div className="card">
              <h3>Compliance Issues</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Bus Number</th>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Issue Type</th>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Description</th>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Due Date</th>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceReport.issues.map((issue, index) => (
                      <tr key={index}>
                        <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{issue.bus_number}</td>
                        <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{issue.issue_type}</td>
                        <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{issue.description}</td>
                        <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
                          {issue.due_date ? new Date(issue.due_date).toLocaleDateString() : '-'}
                        </td>
                        <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: 3,
                            fontSize: 12,
                            backgroundColor: issue.severity === 'high' ? '#ffebee' : 
                                           issue.severity === 'medium' ? '#fff3e0' : '#e8f5e8',
                            color: issue.severity === 'high' ? '#f44336' : 
                                   issue.severity === 'medium' ? '#ff9800' : '#4caf50'
                          }}>
                            {issue.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Reports & Analytics</h2>

      {error && (
        <div style={{ color: '#f44336', marginTop: 15, padding: 10, backgroundColor: '#ffebee', borderRadius: 4 }}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: 10, 
        marginTop: 20, 
        borderBottom: '2px solid #e0e0e0',
        marginBottom: 20
      }}>
        <button
          onClick={() => setActiveTab('revenue')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'revenue' ? '3px solid #2196f3' : 'none',
            fontWeight: activeTab === 'revenue' ? 'bold' : 'normal',
            color: activeTab === 'revenue' ? '#2196f3' : '#666'
          }}
        >
          Revenue Report
        </button>
        <button
          onClick={() => setActiveTab('utilization')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'utilization' ? '3px solid #2196f3' : 'none',
            fontWeight: activeTab === 'utilization' ? 'bold' : 'normal',
            color: activeTab === 'utilization' ? '#2196f3' : '#666'
          }}
        >
          Utilization Report
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'compliance' ? '3px solid #2196f3' : 'none',
            fontWeight: activeTab === 'compliance' ? 'bold' : 'normal',
            color: activeTab === 'compliance' ? '#2196f3' : '#666'
          }}
        >
          Compliance Report
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'revenue' && <RevenueReportTab />}
      {activeTab === 'utilization' && <UtilizationReportTab />}
      {activeTab === 'compliance' && <ComplianceReportTab />}
    </div>
  );
};

export default ReportsManagement;
