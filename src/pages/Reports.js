import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';
import { formatCurrency, formatNumber, formatDate } from '../utils/helpers';

const Reports = () => {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const { loading, error, execute } = useApi();

  const generateReport = async () => {
    try {
      let response;
      switch (reportType) {
        case 'revenue':
          response = await execute(() => AdminService.getRevenueReport(dateRange));
          break;
        case 'utilization':
          response = await execute(() => AdminService.getUtilizationReport(dateRange));
          break;
        case 'subsidy':
          response = await execute(() => AdminService.getSubsidyReport(dateRange));
          break;
        case 'compliance':
          response = await execute(() => AdminService.getComplianceReport());
          break;
        default:
          return;
      }
      setReportData(response.data);
    } catch (err) {
      console.error('Failed to generate report:', err);
    }
  };

  const exportReport = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}_report_${Date.now()}.json`;
    link.click();
  };

  const RevenueReport = ({ data }) => (
    <div>
      <h3>Revenue Report</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 15,
        marginBottom: 20
      }}>
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <div className="stat-value">{formatCurrency(data.total_revenue || 0)}</div>
        </div>
        <div className="stat-card">
          <h4>Ticket Sales</h4>
          <div className="stat-value">{formatCurrency(data.ticket_sales || 0)}</div>
        </div>
        <div className="stat-card">
          <h4>Subsidy Amount</h4>
          <div className="stat-value">{formatCurrency(data.subsidy_amount || 0)}</div>
        </div>
        <div className="stat-card">
          <h4>Total Tickets</h4>
          <div className="stat-value">{formatNumber(data.total_tickets || 0)}</div>
        </div>
      </div>
      
      {data.daily_breakdown && (
        <div>
          <h4>Daily Breakdown</h4>
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
                  <th style={{ padding: 8, textAlign: 'right', borderBottom: '2px solid #ddd' }}>Revenue</th>
                  <th style={{ padding: 8, textAlign: 'right', borderBottom: '2px solid #ddd' }}>Tickets</th>
                </tr>
              </thead>
              <tbody>
                {data.daily_breakdown.map((day, index) => (
                  <tr key={index}>
                    <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{formatDate(day.date)}</td>
                    <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #eee' }}>
                      {formatCurrency(day.revenue)}
                    </td>
                    <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #eee' }}>
                      {formatNumber(day.tickets)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const UtilizationReport = ({ data }) => (
    <div>
      <h3>Utilization Report</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 15,
        marginBottom: 20
      }}>
        <div className="stat-card">
          <h4>Avg Occupancy</h4>
          <div className="stat-value">{data.average_occupancy || 0}%</div>
        </div>
        <div className="stat-card">
          <h4>Total Trips</h4>
          <div className="stat-value">{formatNumber(data.total_trips || 0)}</div>
        </div>
        <div className="stat-card">
          <h4>Passengers Served</h4>
          <div className="stat-value">{formatNumber(data.passengers_served || 0)}</div>
        </div>
        <div className="stat-card">
          <h4>Distance Covered</h4>
          <div className="stat-value">{formatNumber(data.distance_covered || 0)} km</div>
        </div>
      </div>
    </div>
  );

  const SubsidyReport = ({ data }) => (
    <div>
      <h3>Subsidy Report</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 15,
        marginBottom: 20
      }}>
        <div className="stat-card">
          <h4>Total Subsidy</h4>
          <div className="stat-value">{formatCurrency(data.total_subsidy || 0)}</div>
        </div>
        <div className="stat-card">
          <h4>Beneficiaries</h4>
          <div className="stat-value">{formatNumber(data.total_beneficiaries || 0)}</div>
        </div>
        <div className="stat-card">
          <h4>Subsidized Tickets</h4>
          <div className="stat-value">{formatNumber(data.subsidized_tickets || 0)}</div>
        </div>
      </div>
      
      {data.scheme_breakdown && (
        <div>
          <h4>Scheme-wise Breakdown</h4>
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Scheme</th>
                  <th style={{ padding: 8, textAlign: 'right', borderBottom: '2px solid #ddd' }}>Amount</th>
                  <th style={{ padding: 8, textAlign: 'right', borderBottom: '2px solid #ddd' }}>Beneficiaries</th>
                </tr>
              </thead>
              <tbody>
                {data.scheme_breakdown.map((scheme, index) => (
                  <tr key={index}>
                    <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{scheme.scheme_name}</td>
                    <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #eee' }}>
                      {formatCurrency(scheme.amount)}
                    </td>
                    <td style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid #eee' }}>
                      {formatNumber(scheme.beneficiaries)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const ComplianceReport = ({ data }) => (
    <div>
      <h3>Compliance Report</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 15,
        marginBottom: 20
      }}>
        <div className="stat-card" style={{ backgroundColor: '#e8f5e8' }}>
          <h4>Compliant Buses</h4>
          <div className="stat-value" style={{ color: '#4caf50' }}>
            {formatNumber(data.compliant_buses || 0)}
          </div>
        </div>
        <div className="stat-card" style={{ backgroundColor: '#fff3e0' }}>
          <h4>Pending Renewals</h4>
          <div className="stat-value" style={{ color: '#ff9800' }}>
            {formatNumber(data.pending_renewals || 0)}
          </div>
        </div>
        <div className="stat-card" style={{ backgroundColor: '#ffebee' }}>
          <h4>Maintenance Due</h4>
          <div className="stat-value" style={{ color: '#f44336' }}>
            {formatNumber(data.maintenance_due || 0)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Reports & Analytics</h2>

      {/* Report Configuration */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Generate Report</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 15 }}>
          <div>
            <label>Report Type</label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              style={{ width: '100%', padding: '8px 12px' }}
            >
              <option value="revenue">Revenue Report</option>
              <option value="utilization">Utilization Report</option>
              <option value="subsidy">Subsidy Report</option>
              <option value="compliance">Compliance Report</option>
            </select>
          </div>
          
          {reportType !== 'compliance' && (
            <>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  value={dateRange.start_date}
                  onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px' }}
                />
              </div>
              
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  value={dateRange.end_date}
                  onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px' }}
                />
              </div>
            </>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: 15 }}>
          <button 
            className="btn"
            onClick={generateReport}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          
          {reportData && (
            <button 
              className="btn btn-secondary"
              onClick={exportReport}
            >
              Export Report
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      {/* Report Display */}
      {reportData && (
        <div className="card">
          {reportType === 'revenue' && <RevenueReport data={reportData} />}
          {reportType === 'utilization' && <UtilizationReport data={reportData} />}
          {reportType === 'subsidy' && <SubsidyReport data={reportData} />}
          {reportType === 'compliance' && <ComplianceReport data={reportData} />}
        </div>
      )}

      {!reportData && !loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
          Select report type and date range, then click "Generate Report" to view analytics.
        </div>
      )}
    </div>
  );
};

export default Reports;
