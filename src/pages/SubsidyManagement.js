import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';
import { SubsidyScheme } from '../models/SubsidyScheme';
import { formatCurrency, formatNumber } from '../utils/helpers';

const SubsidyManagement = () => {
  const [schemes, setSchemes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const response = await execute(() => AdminService.getAllSubsidySchemes());
      const schemeModels = response.data.map(schemeData => new SubsidyScheme(schemeData));
      setSchemes(schemeModels);
    } catch (err) {
      console.error('Failed to load subsidy schemes:', err);
    }
  };

  const handleToggleSchemeStatus = async (schemeId, currentStatus) => {
    try {
      await execute(() => AdminService.updateSubsidyScheme(schemeId, { is_active: !currentStatus }));
      await loadSchemes();
    } catch (err) {
      console.error('Failed to update scheme status:', err);
    }
  };

  const SchemeCard = ({ scheme }) => {
    const budgetUtilization = scheme.getBudgetUtilizationPercentage();
    
    return (
      <div className="card" style={{ marginBottom: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 5px 0' }}>{scheme.schemeName}</h4>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: 14 }}>
              {scheme.getSubsidyTypeDisplay()}
            </p>
            <p style={{ margin: '0 0 5px 0', fontSize: 12, color: '#666' }}>
              Discount: {scheme.discountPercentage}% (Max: {formatCurrency(scheme.maxDiscountAmount)})
            </p>
            <p style={{ margin: '0', fontSize: 12, color: '#666' }}>
              Beneficiaries: {formatNumber(scheme.beneficiariesCount)} | 
              Age Range: {scheme.getAgeRangeDisplay()}
            </p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              padding: '4px 8px', 
              borderRadius: 4, 
              fontSize: 12,
              backgroundColor: scheme.isActive ? '#e8f5e8' : '#ffebee',
              color: scheme.isActive ? '#4caf50' : '#f44336',
              marginBottom: 5
            }}>
              {scheme.getSchemeStatus()}
            </div>
          </div>
        </div>

        {/* Budget Information */}
        <div style={{ marginTop: 15, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12 }}>Budget Allocated:</span>
            <strong style={{ fontSize: 12 }}>{formatCurrency(scheme.budgetAllocated)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12 }}>Budget Utilized:</span>
            <strong style={{ fontSize: 12 }}>{formatCurrency(scheme.budgetUtilized)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12 }}>Remaining:</span>
            <strong style={{ fontSize: 12, color: scheme.isBudgetExhausted() ? '#f44336' : '#4caf50' }}>
              {formatCurrency(scheme.getRemainingBudget())}
            </strong>
          </div>
          
          {/* Progress Bar */}
          <div style={{ marginTop: 10 }}>
            <div style={{ 
              width: '100%', 
              height: 8, 
              backgroundColor: '#e0e0e0', 
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${Math.min(budgetUtilization, 100)}%`, 
                height: '100%', 
                backgroundColor: budgetUtilization > 90 ? '#f44336' : budgetUtilization > 70 ? '#ff9800' : '#4caf50',
                transition: 'width 0.3s'
              }} />
            </div>
            <div style={{ fontSize: 10, color: '#666', marginTop: 2, textAlign: 'right' }}>
              {budgetUtilization}% utilized
            </div>
          </div>
        </div>

        <div style={{ marginTop: 15, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary"
            style={{ fontSize: 12, padding: '4px 8px' }}
            onClick={() => handleToggleSchemeStatus(scheme.id, scheme.isActive)}
            disabled={loading}
          >
            {scheme.isActive ? 'Deactivate' : 'Activate'}
          </button>
          
          <button 
            className="btn btn-secondary"
            style={{ fontSize: 12, padding: '4px 8px' }}
            onClick={() => setSelectedScheme(scheme)}
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  const AddSchemeForm = () => {
    const [formData, setFormData] = useState({
      scheme_name: '',
      subsidy_type: 'student',
      discount_percentage: 50,
      max_discount_amount: 50,
      validity_period: 365,
      budget_allocated: 1000000,
      description: '',
      eligibility_criteria: {
        age_range: { min: null, max: null },
        required_documents: [],
      }
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await execute(() => AdminService.createSubsidyScheme(formData));
        setShowAddForm(false);
        await loadSchemes();
      } catch (err) {
        console.error('Failed to create subsidy scheme:', err);
      }
    };

    return (
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Create New Subsidy Scheme</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Scheme Name</label>
              <input
                type="text"
                value={formData.scheme_name}
                onChange={(e) => setFormData({...formData, scheme_name: e.target.value})}
                placeholder="Student Concession Scheme"
                required
              />
            </div>
            <div>
              <label>Subsidy Type</label>
              <select
                value={formData.subsidy_type}
                onChange={(e) => setFormData({...formData, subsidy_type: e.target.value})}
              >
                <option value="student">Student</option>
                <option value="senior_citizen">Senior Citizen</option>
                <option value="disabled">Disabled Person</option>
                <option value="low_income">Low Income</option>
                <option value="government_employee">Government Employee</option>
                <option value="military">Military Personnel</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Discount (%)</label>
              <input
                type="number"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({...formData, discount_percentage: parseFloat(e.target.value)})}
                min="0"
                max="100"
                required
              />
            </div>
            <div>
              <label>Max Discount (₹)</label>
              <input
                type="number"
                value={formData.max_discount_amount}
                onChange={(e) => setFormData({...formData, max_discount_amount: parseFloat(e.target.value)})}
                min="0"
                required
              />
            </div>
            <div>
              <label>Budget Allocated (₹)</label>
              <input
                type="number"
                value={formData.budget_allocated}
                onChange={(e) => setFormData({...formData, budget_allocated: parseFloat(e.target.value)})}
                min="0"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the subsidy scheme..."
              rows="3"
              style={{ width: '100%', padding: '8px 12px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 15 }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Scheme'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const totalBudget = schemes.reduce((sum, s) => sum + s.budgetAllocated, 0);
  const totalUtilized = schemes.reduce((sum, s) => sum + s.budgetUtilized, 0);
  const totalBeneficiaries = schemes.reduce((sum, s) => sum + s.beneficiariesCount, 0);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Subsidy Management</h2>
        <button 
          className="btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Scheme'}
        </button>
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      {showAddForm && <AddSchemeForm />}

      {/* Subsidy Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: 15,
        marginBottom: 20
      }}>
        <div className="stat-card">
          <h4>Total Schemes</h4>
          <div className="stat-value">{schemes.length}</div>
        </div>
        <div className="stat-card">
          <h4>Active Schemes</h4>
          <div className="stat-value">{schemes.filter(s => s.isActive).length}</div>
        </div>
        <div className="stat-card">
          <h4>Total Budget</h4>
          <div className="stat-value" style={{ fontSize: 18 }}>{formatCurrency(totalBudget)}</div>
        </div>
        <div className="stat-card">
          <h4>Budget Utilized</h4>
          <div className="stat-value" style={{ fontSize: 18 }}>{formatCurrency(totalUtilized)}</div>
        </div>
        <div className="stat-card">
          <h4>Total Beneficiaries</h4>
          <div className="stat-value">{formatNumber(totalBeneficiaries)}</div>
        </div>
      </div>

      {loading && (
        <div className="loading">Loading subsidy schemes...</div>
      )}

      <div>
        {schemes.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
            No subsidy schemes found. Create your first scheme to get started.
          </div>
        ) : (
          schemes.map(scheme => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))
        )}
      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: 600, maxHeight: '80vh', overflow: 'auto' }}>
            <h3>Scheme Details: {selectedScheme.schemeName}</h3>
            <div style={{ marginBottom: 15 }}>
              <strong>Type:</strong> {selectedScheme.getSubsidyTypeDisplay()}<br/>
              <strong>Discount:</strong> {selectedScheme.discountPercentage}%<br/>
              <strong>Max Discount:</strong> {formatCurrency(selectedScheme.maxDiscountAmount)}<br/>
              <strong>Validity Period:</strong> {selectedScheme.validityPeriod} days<br/>
              <strong>Budget Allocated:</strong> {formatCurrency(selectedScheme.budgetAllocated)}<br/>
              <strong>Budget Utilized:</strong> {formatCurrency(selectedScheme.budgetUtilized)}<br/>
              <strong>Remaining Budget:</strong> {formatCurrency(selectedScheme.getRemainingBudget())}<br/>
              <strong>Beneficiaries:</strong> {formatNumber(selectedScheme.beneficiariesCount)}<br/>
              <strong>Age Range:</strong> {selectedScheme.getAgeRangeDisplay()}<br/>
              <strong>Status:</strong> {selectedScheme.getSchemeStatus()}<br/>
            </div>
            
            {selectedScheme.description && (
              <div style={{ marginBottom: 15 }}>
                <strong>Description:</strong>
                <p style={{ margin: '5px 0', fontSize: 14 }}>{selectedScheme.description}</p>
              </div>
            )}
            
            {selectedScheme.getRequiredDocumentsDisplay().length > 0 && (
              <div style={{ marginBottom: 15 }}>
                <strong>Required Documents:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: 20 }}>
                  {selectedScheme.getRequiredDocumentsDisplay().map((doc, index) => (
                    <li key={index} style={{ fontSize: 14 }}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedScheme(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubsidyManagement;
