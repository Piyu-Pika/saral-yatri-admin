import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';

const ConductorManagement = () => {
  const [conductors, setConductors] = useState([]);
  const [buses, setBuses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [linkingConductor, setLinkingConductor] = useState(null);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadConductors();
    loadBuses();
  }, []);

  const loadConductors = async () => {
    try {
      const response = await execute(() => AdminService.getAllConductors());
      setConductors(response.data || []);
    } catch (err) {
      console.error('Failed to load conductors:', err);
      setConductors([]);
    }
  };

  const loadBuses = async () => {
    try {
      const response = await execute(() => AdminService.getAllBuses());
      setBuses(response.data || []);
    } catch (err) {
      console.error('Failed to load buses:', err);
      setBuses([]);
    }
  };

  const handleDeactivate = async (conductorId) => {
    if (!window.confirm('Are you sure you want to deactivate this conductor?')) return;
    
    try {
      await execute(() => AdminService.deactivateConductor(conductorId));
      await loadConductors();
    } catch (err) {
      console.error('Failed to deactivate conductor:', err);
    }
  };

  const ConductorForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
      employee_id: '',
      name: '',
      phone_number: '',
      email: '',
      address: '',
      date_of_birth: '',
      license_number: '',
      license_expiry: '',
      emergency_contact: {
        name: '',
        phone: '',
        relationship: ''
      }
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await execute(() => AdminService.registerConductor(formData));
        await loadConductors();
        onClose();
      } catch (err) {
        console.error('Failed to register conductor:', err);
      }
    };

    return (
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Register New Conductor</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Employee ID *</label>
              <input
                type="text"
                value={formData.employee_id}
                onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                placeholder="EMP001"
                required
              />
            </div>
            <div>
              <label>Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Phone Number *</label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Date of Birth *</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                required
              />
            </div>
            <div>
              <label>License Number *</label>
              <input
                type="text"
                value={formData.license_number}
                onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                required
              />
            </div>
            <div>
              <label>License Expiry *</label>
              <input
                type="date"
                value={formData.license_expiry}
                onChange={(e) => setFormData({...formData, license_expiry: e.target.value})}
                required
              />
            </div>
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 10 }}>Emergency Contact</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Name</label>
              <input
                type="text"
                value={formData.emergency_contact.name}
                onChange={(e) => setFormData({
                  ...formData,
                  emergency_contact: {...formData.emergency_contact, name: e.target.value}
                })}
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                type="tel"
                value={formData.emergency_contact.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  emergency_contact: {...formData.emergency_contact, phone: e.target.value}
                })}
              />
            </div>
            <div>
              <label>Relationship</label>
              <input
                type="text"
                value={formData.emergency_contact.relationship}
                onChange={(e) => setFormData({
                  ...formData,
                  emergency_contact: {...formData.emergency_contact, relationship: e.target.value}
                })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register Conductor'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const LinkToBusModal = ({ conductor, onClose }) => {
    const [selectedBusId, setSelectedBusId] = useState('');

    const handleLink = async () => {
      if (!selectedBusId) return;
      
      try {
        await execute(() => AdminService.linkConductorToBus(conductor.id, selectedBusId));
        await loadConductors();
        onClose();
      } catch (err) {
        console.error('Failed to link conductor to bus:', err);
      }
    };

    return (
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
        <div className="card" style={{ maxWidth: 500, width: '90%' }}>
          <h3>Link Conductor to Bus</h3>
          <p>Conductor: <strong>{conductor.name}</strong></p>
          
          <div style={{ marginBottom: 15 }}>
            <label>Select Bus</label>
            <select
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Choose a bus...</option>
              {buses.map(bus => (
                <option key={bus.id} value={bus.id}>
                  {bus.bus_number} - {bus.fleet_number}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" onClick={handleLink} disabled={!selectedBusId || loading}>
              {loading ? 'Linking...' : 'Link to Bus'}
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Conductor Management</h2>
        <button className="btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Register New Conductor'}
        </button>
      </div>

      {error && (
        <div style={{ color: '#f44336', marginBottom: 15, padding: 10, backgroundColor: '#ffebee', borderRadius: 4 }}>
          {error}
        </div>
      )}

      {showAddForm && <ConductorForm onClose={() => setShowAddForm(false)} />}

      {loading && !conductors.length ? (
        <div style={{ textAlign: 'center', padding: 20 }}>Loading conductors...</div>
      ) : (
        <div>
          {conductors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
              No conductors found. Register your first conductor to get started.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 15 }}>
              {conductors.map(conductor => (
                <div key={conductor.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>
                        {conductor.name} ({conductor.employee_id})
                      </h4>
                      <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: 14 }}>
                        Phone: {conductor.phone_number}
                        {conductor.email && ` | Email: ${conductor.email}`}
                      </p>
                      <p style={{ margin: '0 0 5px 0', fontSize: 12, color: '#666' }}>
                        License: {conductor.license_number} (Expires: {new Date(conductor.license_expiry).toLocaleDateString()})
                      </p>
                      {conductor.current_bus && (
                        <p style={{ margin: '5px 0 0 0', fontSize: 12 }}>
                          <span style={{ 
                            padding: '2px 6px',
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            borderRadius: 3
                          }}>
                            Assigned to: {conductor.current_bus.bus_number}
                          </span>
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexDirection: 'column' }}>
                      <div style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4, 
                        fontSize: 12,
                        backgroundColor: conductor.is_active ? '#e8f5e8' : '#ffebee',
                        color: conductor.is_active ? '#4caf50' : '#f44336'
                      }}>
                        {conductor.is_active ? 'Active' : 'Inactive'}
                      </div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button 
                          className="btn btn-secondary"
                          style={{ fontSize: 12, padding: '4px 8px' }}
                          onClick={() => setLinkingConductor(conductor)}
                        >
                          Link to Bus
                        </button>
                        {conductor.is_active && (
                          <button 
                            className="btn"
                            style={{ fontSize: 12, padding: '4px 8px', backgroundColor: '#f44336' }}
                            onClick={() => handleDeactivate(conductor.id)}
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {linkingConductor && (
        <LinkToBusModal 
          conductor={linkingConductor} 
          onClose={() => setLinkingConductor(null)} 
        />
      )}
    </div>
  );
};

export default ConductorManagement;
