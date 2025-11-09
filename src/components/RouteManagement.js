import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadRoutes();
    loadStations();
  }, []);

  const loadRoutes = async () => {
    try {
      const response = await execute(() => AdminService.getAllRoutes());
      setRoutes(response.data || []);
    } catch (err) {
      console.error('Failed to load routes:', err);
      setRoutes([]);
    }
  };

  const loadStations = async () => {
    try {
      const response = await execute(() => AdminService.getAllStations());
      setStations(response.data || []);
    } catch (err) {
      console.error('Failed to load stations:', err);
      setStations([]);
      // Show helpful message if no stations exist
      if (err.message.includes('not found')) {
        alert('No stations found. Please create stations first before adding routes.');
      }
    }
  };

  const RouteForm = ({ route, onClose }) => {
    const defaultFormData = {
      route_number: '',
      route_name: '',
      route_type: 'ordinary',
      start_station_id: '',
      end_station_id: '',
      total_distance: 0,
      estimated_duration: 0,
      fare_structure: {
        base_fare: 10.0,
        per_km_rate: 2.0,
        minimum_fare: 5.0,
        maximum_fare: 50.0
      },
      schedule: {
        first_bus_time: '05:00',
        last_bus_time: '23:00',
        frequency_minutes: 15,
        operating_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      is_active: true,
      stations: []
    };

    const [formData, setFormData] = useState(() => {
      if (!route) return defaultFormData;
      
      // Merge route data with defaults to ensure all fields exist
      return {
        ...defaultFormData,
        ...route,
        fare_structure: {
          ...defaultFormData.fare_structure,
          ...(route.fare_structure || {})
        },
        schedule: {
          ...defaultFormData.schedule,
          ...(route.schedule || {})
        }
      };
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (route) {
          await execute(() => AdminService.updateRoute(route.id, formData));
        } else {
          await execute(() => AdminService.createRoute(formData));
        }
        await loadRoutes();
        onClose();
      } catch (err) {
        console.error('Failed to save route:', err);
      }
    };

    return (
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>{route ? 'Edit Route' : 'Create New Route'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Route Number *</label>
              <input
                type="text"
                value={formData.route_number}
                onChange={(e) => setFormData({...formData, route_number: e.target.value})}
                placeholder="101"
                required
              />
            </div>
            <div>
              <label>Route Name *</label>
              <input
                type="text"
                value={formData.route_name}
                onChange={(e) => setFormData({...formData, route_name: e.target.value})}
                placeholder="Central Terminal to Airport"
                required
              />
            </div>
            <div>
              <label>Route Type *</label>
              <select
                value={formData.route_type}
                onChange={(e) => setFormData({...formData, route_type: e.target.value})}
                required
              >
                <option value="ordinary">Ordinary</option>
                <option value="express">Express</option>
                <option value="deluxe">Deluxe</option>
                <option value="ac">AC</option>
                <option value="non_ac">Non-AC</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Start Station *</label>
              <select
                value={formData.start_station_id}
                onChange={(e) => setFormData({...formData, start_station_id: e.target.value})}
                required
              >
                <option value="">Select Station</option>
                {stations.map(station => (
                  <option key={station.id} value={station.id}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>End Station *</label>
              <select
                value={formData.end_station_id}
                onChange={(e) => setFormData({...formData, end_station_id: e.target.value})}
                required
              >
                <option value="">Select Station</option>
                {stations.map(station => (
                  <option key={station.id} value={station.id}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Distance (km) *</label>
              <input
                type="number"
                step="0.1"
                value={formData.total_distance}
                onChange={(e) => setFormData({...formData, total_distance: parseFloat(e.target.value)})}
                required
              />
            </div>
            <div>
              <label>Duration (min) *</label>
              <input
                type="number"
                value={formData.estimated_duration}
                onChange={(e) => setFormData({...formData, estimated_duration: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 10 }}>Fare Structure</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Base Fare (₹) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.fare_structure.base_fare}
                onChange={(e) => setFormData({
                  ...formData, 
                  fare_structure: {...formData.fare_structure, base_fare: parseFloat(e.target.value)}
                })}
                required
              />
            </div>
            <div>
              <label>Per KM Rate (₹) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.fare_structure.per_km_rate}
                onChange={(e) => setFormData({
                  ...formData, 
                  fare_structure: {...formData.fare_structure, per_km_rate: parseFloat(e.target.value)}
                })}
                required
              />
            </div>
            <div>
              <label>Min Fare (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.fare_structure.minimum_fare}
                onChange={(e) => setFormData({
                  ...formData, 
                  fare_structure: {...formData.fare_structure, minimum_fare: parseFloat(e.target.value)}
                })}
              />
            </div>
            <div>
              <label>Max Fare (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.fare_structure.maximum_fare}
                onChange={(e) => setFormData({
                  ...formData, 
                  fare_structure: {...formData.fare_structure, maximum_fare: parseFloat(e.target.value)}
                })}
              />
            </div>
          </div>

          <h4 style={{ marginTop: 20, marginBottom: 10 }}>Schedule</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 15, marginBottom: 15 }}>
            <div>
              <label>First Bus Time</label>
              <input
                type="time"
                value={formData.schedule.first_bus_time}
                onChange={(e) => setFormData({
                  ...formData, 
                  schedule: {...formData.schedule, first_bus_time: e.target.value}
                })}
              />
            </div>
            <div>
              <label>Last Bus Time</label>
              <input
                type="time"
                value={formData.schedule.last_bus_time}
                onChange={(e) => setFormData({
                  ...formData, 
                  schedule: {...formData.schedule, last_bus_time: e.target.value}
                })}
              />
            </div>
            <div>
              <label>Frequency (min)</label>
              <input
                type="number"
                value={formData.schedule.frequency_minutes}
                onChange={(e) => setFormData({
                  ...formData, 
                  schedule: {...formData.schedule, frequency_minutes: parseInt(e.target.value)}
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
              {' '}Active Route
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Saving...' : route ? 'Update Route' : 'Create Route'}
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
        <h2>Route Management</h2>
        <button className="btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Route'}
        </button>
      </div>

      {error && (
        <div style={{ color: '#f44336', marginBottom: 15, padding: 10, backgroundColor: '#ffebee', borderRadius: 4 }}>
          {error}
        </div>
      )}

      {(showAddForm || editingRoute) && (
        <RouteForm 
          route={editingRoute} 
          onClose={() => {
            setShowAddForm(false);
            setEditingRoute(null);
          }} 
        />
      )}

      {loading && !routes.length ? (
        <div style={{ textAlign: 'center', padding: 20 }}>Loading routes...</div>
      ) : (
        <div>
          {routes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
              No routes found. Create your first route to get started.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 15 }}>
              {routes.map(route => (
                <div key={route.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>
                        {route.route_number} - {route.route_name}
                      </h4>
                      <p style={{ margin: '0 0 5px 0', fontSize: 12 }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: 3,
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          fontSize: 11
                        }}>
                          {route.route_type?.toUpperCase() || 'ORDINARY'}
                        </span>
                      </p>
                      <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: 14 }}>
                        Distance: {route.total_distance || route.distance_km || 0} km | 
                        Duration: {route.estimated_duration || route.estimated_duration_minutes || 0} min
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                        Base Fare: ₹{route.fare_structure?.base_fare || route.fare_ordinary || 0} | 
                        Per KM: ₹{route.fare_structure?.per_km_rate || 0}
                      </p>
                      {route.schedule && (
                        <p style={{ margin: '5px 0 0 0', fontSize: 11, color: '#666' }}>
                          Schedule: {route.schedule.first_bus_time} - {route.schedule.last_bus_time} 
                          (Every {route.schedule.frequency_minutes} min)
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4, 
                        fontSize: 12,
                        backgroundColor: route.is_active ? '#e8f5e8' : '#ffebee',
                        color: route.is_active ? '#4caf50' : '#f44336'
                      }}>
                        {route.is_active ? 'Active' : 'Inactive'}
                      </div>
                      <button 
                        className="btn btn-secondary"
                        style={{ fontSize: 12, padding: '4px 8px' }}
                        onClick={() => setEditingRoute(route)}
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
      )}
    </div>
  );
};

export default RouteManagement;
