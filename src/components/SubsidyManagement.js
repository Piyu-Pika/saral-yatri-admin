import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';
import { formatCurrency } from '../utils/helpers';

const SubsidyManagement = () => {
  const [schemes, setSchemes] = useState([]);
  const [report, setReport] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [reportParams, setReportParams] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });
  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const response = await execute(() => AdminService.getSubsidySchemes());
      setSchemes(response.data || []);
    } catch (err) {
      console.error('Failed to load schemes:', err);
      setSchemes([]);
    }
  };

  const loadReport = async () => {
    try {
      const response = await execute(() => AdminService.getSubsidyReport(reportParams));
      setReport(response.data);
    } catch (err) {
      console.error('Failed to load report:', err);
      setReport(null);
    }
  };

  const SchemeForm = ({ scheme, onClose }) => {
    const defaultFormData = {
      scheme_name: '',
      scheme_code: '',
      description: '',
      eligibility_criteria: {
        age_min: 0,
        age_max: 100,
        categories: []
      },
      discount_percentage: 0,
      max_discount_amount: 0,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: '',
      is_active: true
    };

    const [formData, setFormData] = useState(() => {
      if (!scheme) return defaultFormData;
      
      // Merge scheme data with defaults to ensure all fields exist
      return {
        ...defaultFormData,
        ...scheme,
        eligibility_criteria: {
          ...defaultFormData.eligibility_criteria,
          ...(scheme.eligibility_criteria || {})
        }
      };
    });

    const categoryOptions = [
      'student',
      'senior_citizen',
      'disabled',
      'women',
      'low_income',
      'veteran',
      'child'
    ];

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (scheme) {
          await execute(() => AdminService.updateSubsidyScheme(scheme.id, formData));
        } else {
          await execute(() => AdminService.createSubsidyScheme(formData));
        }
        await loadSchemes();
        onClose();
      } catch (err) {
        console.error('Failed to save scheme:', err);
      }
    };

    const toggleCategory = (category) => {
      const categories = formData.eligibility_criteria.categories || [];
      if (categories.includes(category)) {
        setFormData({
          ...formData,
          eligibility_criteria: {
            ...formData.eligibility_criteria,
            categories: categories.filter(c => c !== category)
          }
        });
      } else {
        setFormData({
          ...formData,
          eligibility_criteria: {
            ...formData.eligibility_criteria,
            categories: [...categories, category]
          }
        });
      }
    };

    return (
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>{scheme ? 'Edit Subsidy Scheme' : 'Create New Subsidy Scheme'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Scheme Code *</label>
              <input
                type="text"
                value={formData.scheme_code}
                onChange={(e) => setFormData({...formData, scheme_code: e.target.value})}
                placeholder="SCH001"
                required
              />
            </div>
            <div>
              <label>Scheme Name *</label>
              <input
                type="text"
                value={formData.scheme_name}
                onChange={(e) => setFormData({...formData, scheme_name: e.target.value})}
                placeholder="Senior Citizen Discount"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Min Age</label>
              <input
                type="number"
                value={formData.eligibility_criteria.age_min}
                onChange={(e) => setFormData({
                  ...formData,
                  eligibility_criteria: {
                    ...formData.eligibility_criteria,
                    age_min: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <label>Max Age</label>
              <input
                type="number"
                value={formData.eligibility_criteria.age_max}
                onChange={(e) => setFormData({
                  ...formData,
                  eligibility_criteria: {
                    ...formData.eligibility_criteria,
                    age_max: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <label>Discount % *</label>
              <input
                type="number"
                step="0.01"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({...formData, discount_percentage: parseFloat(e.target.value)})}
                required
              />
            </div>
            <div>
              <label>Max Discount ₹</label>
              <input
                type="number"
                step="0.01"
                value={formData.max_discount_amount}
                onChange={(e) => setFormData({...formData, max_discount_amount: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Eligible Categories</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {categoryOptions.map(category => (
                <label key={category} style={{ fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={(formData.eligibility_criteria.categories || []).includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  {' '}{category.replace('_', ' ').toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Valid From *</label>
              <input
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Valid Until</label>
              <input
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
              />
            </div>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
              {' '}Active Scheme
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Saving...' : scheme ? 'Update Scheme' : 'Create Scheme'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Subsidy Management</h2>

      {/* Schemes Section */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <h3>Subsidy Schemes</h3>
          <button className="btn" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Create New Scheme'}
          </button>
        </div>

        {error && (
          <div style={{ color: '#f44336', marginBottom: 15, padding: 10, backgroundColor: '#ffebee', borderRadius: 4 }}>
            {error}
          </div>
        )}

        {(showAddForm || editingScheme) && (
          <SchemeForm 
            scheme={editingScheme} 
            onClose={() => {
              setShowAddForm(false);
              setEditingScheme(null);
            }} 
          />
        )}

        {loading && !schemes.length ? (
          <div style={{ textAlign: 'center', padding: 20 }}>Loading schemes...</div>
        ) : (
          <div style={{ display: 'grid', gap: 15, marginBottom: 30 }}>
            {schemes.map(scheme => (
              <div key={scheme.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>
                      {scheme.scheme_code} - {scheme.scheme_name}
                    </h4>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: 14 }}>
                      {scheme.description}
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: 13 }}>
                      <strong>Discount:</strong> {scheme.discount_percentage}%
                      {scheme.max_discount_amount > 0 && ` (Max: ${formatCurrency(scheme.max_discount_amount)})`}
                    </p>
                    <p style={{ margin: '0 0 5px 0', fontSize: 12, color: '#666' }}>
                      Valid: {new Date(scheme.valid_from).toLocaleDateString()} 
                      {scheme.valid_until && ` - ${new Date(scheme.valid_until).toLocaleDateString()}`}
                    </p>
                    {scheme.eligibility_criteria?.categories?.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        {scheme.eligibility_criteria.categories.map(cat => (
                          <span 
                            key={cat}
                            style={{ 
                              display: 'inline-block',
                              padding: '2px 6px',
                              marginRight: 5,
                              fontSize: 11,
                              backgroundColor: '#e8f5e8',
                              color: '#4caf50',
                              borderRadius: 3
                            }}
                          >
                            {cat.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ 
                      padding: '4px 8px', 
                      borderRadius: 4, 
                      fontSize: 12,
                      backgroundColor: scheme.is_active ? '#e8f5e8' : '#ffebee',
                      color: scheme.is_active ? '#4caf50' : '#f44336'
                    }}>
                      {scheme.is_active ? 'Active' : 'Inactive'}
                    </div>
                    <button 
                      className="btn btn-secondary"
                      style={{ fontSize: 12, padding: '4px 8px' }}
                      onClick={() => setEditingScheme(scheme)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reports Section */}
      <div style={{ marginTop: 40 }}>
        <h3>Subsidy Reports</h3>
        <div className="card" style={{ marginTop: 15 }}>
          <div style={{ display: 'flex', gap: 15, alignItems: 'flex-end', marginBottom: 15 }}>
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
            <button className="btn" onClick={loadReport} disabled={loading}>
              {loading ? 'Loading...' : 'Generate Report'}
            </button>
          </div>

          {report && (
            <div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: 15,
                marginTop: 20
              }}>
                <div style={{ padding: 15, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                  <div style={{ fontSize: 12, color: '#666' }}>Total Subsidies</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 5 }}>
                    {formatCurrency(report.total_subsidy_amount || 0)}
                  </div>
                </div>
                <div style={{ padding: 15, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                  <div style={{ fontSize: 12, color: '#666' }}>Beneficiaries</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 5 }}>
                    {report.total_beneficiaries || 0}
                  </div>
                </div>
                <div style={{ padding: 15, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                  <div style={{ fontSize: 12, color: '#666' }}>Subsidized Tickets</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', marginTop: 5 }}>
                    {report.total_tickets || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubsidyManagement;
