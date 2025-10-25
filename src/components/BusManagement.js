import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';
import { Bus } from '../models/Bus';
import { formatDate } from '../utils/helpers';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const response = await execute(() => AdminService.getAllBuses());
      const busModels = response.data.map(busData => new Bus(busData));
      setBuses(busModels);
    } catch (err) {
      console.error('Failed to load buses:', err);
    }
  };

  const handleStatusUpdate = async (busId, newStatus) => {
    try {
      await execute(() => AdminService.updateBusStatus(busId, { 
        status: newStatus,
        remarks: `Status updated to ${newStatus}` 
      }));
      await loadBuses(); // Reload the list
    } catch (err) {
      console.error('Failed to update bus status:', err);
    }
  };

  const BusCard = ({ bus }) => {
    const compliance = bus.getComplianceStatus();
    
    return (
      <div className="card" style={{ marginBottom: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ margin: '0 0 5px 0' }}>
              {bus.busNumber} ({bus.fleetNumber})
            </h4>
            <p style={{ margin: '0 0 5px 0', color: '#666' }}>
              Type: {bus.busType.toUpperCase()} | 
              Capacity: {bus.specifications.seatingCapacity} seats
            </p>
            <p style={{ margin: '0 0 10px 0', fontSize: 12, color: '#666' }}>
              Manufacturer: {bus.specifications.manufacturer} {bus.specifications.model} 
              ({bus.specifications.yearOfManufacture})
            </p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              padding: '4px 8px', 
              borderRadius: 4, 
              fontSize: 12,
              backgroundColor: bus.isOperational() ? '#e8f5e8' : '#ffebee',
              color: bus.isOperational() ? '#4caf50' : '#f44336',
              marginBottom: 5
            }}>
              {bus.getStatusDisplay()}
            </div>
            
            {!compliance.isCompliant && (
              <div style={{ 
                padding: '2px 6px', 
                borderRadius: 4, 
                fontSize: 10,
                backgroundColor: '#ffebee',
                color: '#f44336'
              }}>
                Compliance Issues
              </div>
            )}
          </div>
        </div>

        {/* Compliance Details */}
        {!compliance.isCompliant && (
          <div style={{ marginTop: 10, padding: 10, backgroundColor: '#fff3e0', borderRadius: 4 }}>
            <strong style={{ fontSize: 12 }}>Compliance Issues:</strong>
            <ul style={{ margin: '5px 0 0 0', paddingLeft: 15, fontSize: 11 }}>
              {compliance.issues.map((issue, index) => (
                <li key={index}>{issue.replace('_', ' ').toUpperCase()}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ marginTop: 15, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select 
            onChange={(e) => handleStatusUpdate(bus.id, e.target.value)}
            value={bus.currentStatus}
            style={{ padding: '4px 8px', fontSize: 12 }}
          >
            <option value="active">Active</option>
            <option value="parked">Parked</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_service">Out of Service</option>
            <option value="breakdown">Breakdown</option>
          </select>
          
          <button 
            className="btn btn-secondary"
            style={{ fontSize: 12, padding: '4px 8px' }}
            onClick={() => setSelectedBus(bus)}
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  const AddBusForm = () => {
    const [formData, setFormData] = useState({
      bus_number: '',
      fleet_number: '',
      bus_type: 'ordinary',
      specifications: {
        seating_capacity: 40,
        manufacturer: '',
        model: '',
        year_of_manufacture: new Date().getFullYear(),
        fuel_type: 'diesel',
        has_air_conditioning: false,
        is_accessible: false,
      }
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await execute(() => AdminService.registerBus(formData));
        setShowAddForm(false);
        await loadBuses();
      } catch (err) {
        console.error('Failed to register bus:', err);
      }
    };

    return (
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Register New Bus</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Bus Number</label>
              <input
                type="text"
                value={formData.bus_number}
                onChange={(e) => setFormData({...formData, bus_number: e.target.value})}
                placeholder="MH-01-AB-1234"
                required
              />
            </div>
            <div>
              <label>Fleet Number</label>
              <input
                type="text"
                value={formData.fleet_number}
                onChange={(e) => setFormData({...formData, fleet_number: e.target.value})}
                placeholder="FL001"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Bus Type</label>
              <select
                value={formData.bus_type}
                onChange={(e) => setFormData({...formData, bus_type: e.target.value})}
              >
                <option value="ordinary">Ordinary</option>
                <option value="ac">AC</option>
                <option value="deluxe">Deluxe</option>
                <option value="volvo">Volvo</option>
              </select>
            </div>
            <div>
              <label>Seating Capacity</label>
              <input
                type="number"
                value={formData.specifications.seating_capacity}
                onChange={(e) => setFormData({
                  ...formData, 
                  specifications: {
                    ...formData.specifications,
                    seating_capacity: parseInt(e.target.value)
                  }
                })}
                min="20"
                max="60"
              />
            </div>
            <div>
              <label>Year of Manufacture</label>
              <input
                type="number"
                value={formData.specifications.year_of_manufacture}
                onChange={(e) => setFormData({
                  ...formData, 
                  specifications: {
                    ...formData.specifications,
                    year_of_manufacture: parseInt(e.target.value)
                  }
                })}
                min="2000"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 15, marginBottom: 15 }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register Bus'}
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

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Bus Management</h2>
        <button 
          className="btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Bus'}
        </button>
      </div>

      {error && (
        <div style={{ color: '#f44336', marginBottom: 15, padding: 10, backgroundColor: '#ffebee', borderRadius: 4 }}>
          {error}
        </div>
      )}

      {showAddForm && <AddBusForm />}

      {loading && (
        <div style={{ textAlign: 'center', padding: 20 }}>
          Loading buses...
        </div>
      )}

      <div>
        {buses.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
            No buses found. Add your first bus to get started.
          </div>
        ) : (
          buses.map(bus => (
            <BusCard key={bus.id} bus={bus} />
          ))
        )}
      </div>

      {/* Bus Details Modal */}
      {selectedBus && (
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
            <h3>Bus Details: {selectedBus.busNumber}</h3>
            <div style={{ marginBottom: 15 }}>
              <strong>Fleet Number:</strong> {selectedBus.fleetNumber}<br/>
              <strong>Type:</strong> {selectedBus.busType}<br/>
              <strong>Status:</strong> {selectedBus.getStatusDisplay()}<br/>
              <strong>Capacity:</strong> {selectedBus.specifications.seatingCapacity} seats<br/>
              <strong>Manufacturer:</strong> {selectedBus.specifications.manufacturer} {selectedBus.specifications.model}<br/>
              <strong>Year:</strong> {selectedBus.specifications.yearOfManufacture}<br/>
              <strong>AC:</strong> {selectedBus.specifications.hasAirConditioning ? 'Yes' : 'No'}<br/>
              <strong>Accessible:</strong> {selectedBus.specifications.isAccessible ? 'Yes' : 'No'}<br/>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedBus(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusManagement;