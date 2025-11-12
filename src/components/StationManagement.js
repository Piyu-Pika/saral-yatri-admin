import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';

const StationManagement = () => {
  const [stations, setStations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadStations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStations = async () => {
    try {
      const response = await execute(() => AdminService.getAllStations());
      setStations(response.data || []);
    } catch (err) {
      console.error('Failed to load stations:', err);
      setStations([]);
    }
  };

  const StationForm = ({ station, onClose }) => {
    const defaultFormData = {
      station_code: '',
      station_name: '',
      station_type: 'stop',
      address: {
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India'
      },
      location: {
        latitude: '',
        longitude: ''
      },
      facilities: {
        waiting_area: false,
        restrooms: false,
        ticket_counter: false,
        parking: false,
        wheelchair_accessible: false,
        food_court: false,
        wifi: false
      },
      operational_hours: {
        opening_time: '05:00',
        closing_time: '23:00',
        is_24_hours: false
      },
      capacity: {
        platform_count: 1,
        max_buses_at_once: 5
      },
      is_active: true
    };

    const [formData, setFormData] = useState(() => {
      if (!station) return defaultFormData;
      
      // Merge station data with defaults to ensure all fields exist
      return {
        ...defaultFormData,
        ...station,
        address: {
          ...defaultFormData.address,
          ...(station.address || {})
        },
        location: {
          ...defaultFormData.location,
          ...(station.location || {})
        },
        facilities: {
          ...defaultFormData.facilities,
          ...(station.facilities || {})
        },
        operational_hours: {
          ...defaultFormData.operational_hours,
          ...(station.operational_hours || {})
        },
        capacity: {
          ...defaultFormData.capacity,
          ...(station.capacity || {})
        }
      };
    });

    const facilityOptions = [
      { key: 'waiting_area', label: 'Waiting Area' },
      { key: 'restrooms', label: 'Restrooms' },
      { key: 'ticket_counter', label: 'Ticket Counter' },
      { key: 'parking', label: 'Parking' },
      { key: 'wheelchair_accessible', label: 'Wheelchair Accessible' },
      { key: 'food_court', label: 'Food Court' },
      { key: 'wifi', label: 'WiFi' }
    ];

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (station) {
          await execute(() => AdminService.updateStation(station.id, formData));
        } else {
          await execute(() => AdminService.createStation(formData));
        }
        await loadStations();
        onClose();
      } catch (err) {
        console.error('Failed to save station:', err);
      }
    };

    const toggleFacility = (facilityKey) => {
      setFormData({
        ...formData,
        facilities: {
          ...formData.facilities,
          [facilityKey]: !formData.facilities[facilityKey]
        }
      });
    };

    return (
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>{station ? 'Edit Station' : 'Create New Station'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Station Code *</label>
              <input
                type="text"
                value={formData.station_code}
                onChange={(e) => setFormData({...formData, station_code: e.target.value})}
                placeholder="CBT001"
                required
              />
            </div>
            <div>
              <label>Station Name *</label>
              <input
                type="text"
                value={formData.station_name}
                onChange={(e) => setFormData({...formData, station_name: e.target.value})}
                placeholder="Central Bus Terminal"
                required
              />
            </div>
            <div>
              <label>Station Type *</label>
              <select
                value={formData.station_type}
                onChange={(e) => setFormData({...formData, station_type: e.target.value})}
                required
              >
                <option value="stop">Stop</option>
                <option value="terminal">Terminal</option>
                <option value="interchange">Interchange</option>
                <option value="depot">Depot</option>
              </select>
            </div>
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 10 }}>Address</h4>
          <div style={{ marginBottom: 15 }}>
            <label>Street *</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => setFormData({
                ...formData, 
                address: {...formData.address, street: e.target.value}
              })}
              placeholder="Main Road"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, marginBottom: 15 }}>
            <div>
              <label>City *</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, city: e.target.value}
                })}
                required
              />
            </div>
            <div>
              <label>State *</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, state: e.target.value}
                })}
                required
              />
            </div>
            <div>
              <label>Postal Code *</label>
              <input
                type="text"
                value={formData.address.postal_code}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: {...formData.address, postal_code: e.target.value}
                })}
                required
              />
            </div>
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 10 }}>Location</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Latitude</label>
              <input
                type="number"
                step="0.000001"
                value={formData.location.latitude}
                onChange={(e) => setFormData({
                  ...formData, 
                  location: {...formData.location, latitude: e.target.value}
                })}
                placeholder="28.6139"
              />
            </div>
            <div>
              <label>Longitude</label>
              <input
                type="number"
                step="0.000001"
                value={formData.location.longitude}
                onChange={(e) => setFormData({
                  ...formData, 
                  location: {...formData.location, longitude: e.target.value}
                })}
                placeholder="77.2090"
              />
            </div>
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 10 }}>Facilities</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 15 }}>
            {facilityOptions.map(facility => (
              <label key={facility.key} style={{ fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={formData.facilities[facility.key] || false}
                  onChange={() => toggleFacility(facility.key)}
                />
                {' '}{facility.label}
              </label>
            ))}
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 10 }}>Operational Hours</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Opening Time</label>
              <input
                type="time"
                value={formData.operational_hours.opening_time}
                onChange={(e) => setFormData({
                  ...formData, 
                  operational_hours: {...formData.operational_hours, opening_time: e.target.value}
                })}
              />
            </div>
            <div>
              <label>Closing Time</label>
              <input
                type="time"
                value={formData.operational_hours.closing_time}
                onChange={(e) => setFormData({
                  ...formData, 
                  operational_hours: {...formData.operational_hours, closing_time: e.target.value}
                })}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', marginTop: 25 }}>
                <input
                  type="checkbox"
                  checked={formData.operational_hours.is_24_hours}
                  onChange={(e) => setFormData({
                    ...formData, 
                    operational_hours: {...formData.operational_hours, is_24_hours: e.target.checked}
                  })}
                />
                {' '}24 Hours
              </label>
            </div>
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 10 }}>Capacity</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Platform Count</label>
              <input
                type="number"
                value={formData.capacity.platform_count}
                onChange={(e) => setFormData({
                  ...formData, 
                  capacity: {...formData.capacity, platform_count: parseInt(e.target.value)}
                })}
              />
            </div>
            <div>
              <label>Max Buses at Once</label>
              <input
                type="number"
                value={formData.capacity.max_buses_at_once}
                onChange={(e) => setFormData({
                  ...formData, 
                  capacity: {...formData.capacity, max_buses_at_once: parseInt(e.target.value)}
                })}
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
              {' '}Active Station
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Saving...' : station ? 'Update Station' : 'Create Station'}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Station Management</h2>
        <button className="btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Station'}
        </button>
      </div>

      {error && (
        <div style={{ color: '#f44336', marginBottom: 15, padding: 10, backgroundColor: '#ffebee', borderRadius: 4 }}>
          {error}
        </div>
      )}

      {(showAddForm || editingStation) && (
        <StationForm 
          station={editingStation} 
          onClose={() => {
            setShowAddForm(false);
            setEditingStation(null);
          }} 
        />
      )}

      {loading && !stations.length ? (
        <div style={{ textAlign: 'center', padding: 20 }}>Loading stations...</div>
      ) : (
        <div>
          {stations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
              No stations found. Create your first station to get started.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 15 }}>
              {stations.map(station => {
                const address = station.address || {};
                const facilities = station.facilities || {};
                const activeFacilities = Object.entries(facilities)
                  .filter(([key, value]) => value === true)
                  .map(([key]) => key);
                
                return (
                  <div key={station.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: '250px' }}>
                        <h4 style={{ margin: '0 0 5px 0' }}>
                          {station.station_code} - {station.station_name}
                        </h4>
                        <p style={{ margin: '0 0 5px 0', fontSize: 12 }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: 3,
                            backgroundColor: '#f3e5f5',
                            color: '#7b1fa2',
                            fontSize: 11
                          }}>
                            {station.station_type?.toUpperCase() || 'STOP'}
                          </span>
                        </p>
                        <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: 14 }}>
                          {address.street || station.address}, {address.city || station.city}, {address.state || station.state}
                          {address.postal_code || station.pincode ? ` - ${address.postal_code || station.pincode}` : ''}
                        </p>
                        {station.operational_hours && (
                          <p style={{ margin: '5px 0 0 0', fontSize: 11, color: '#666' }}>
                            Hours: {station.operational_hours.is_24_hours ? '24/7' : 
                              `${station.operational_hours.opening_time} - ${station.operational_hours.closing_time}`}
                          </p>
                        )}
                        {activeFacilities.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            {activeFacilities.map(facility => (
                              <span 
                                key={facility}
                                style={{ 
                                  display: 'inline-block',
                                  padding: '2px 6px',
                                  marginRight: 5,
                                  marginBottom: 5,
                                  fontSize: 11,
                                  backgroundColor: '#e3f2fd',
                                  color: '#1976d2',
                                  borderRadius: 3
                                }}
                              >
                                {facility.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ 
                          padding: '4px 8px', 
                          borderRadius: 4, 
                          fontSize: 12,
                          backgroundColor: station.is_active ? '#e8f5e8' : '#ffebee',
                          color: station.is_active ? '#4caf50' : '#f44336'
                        }}>
                          {station.is_active ? 'Active' : 'Inactive'}
                        </div>
                        <button 
                          className="btn btn-secondary"
                          style={{ fontSize: 12, padding: '4px 8px' }}
                          onClick={() => setEditingStation(station)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StationManagement;
