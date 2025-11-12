import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';
import { Route } from '../models/Route';
import { formatCurrency } from '../utils/helpers';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const response = await execute(() => AdminService.getAllRoutes());
      const routeModels = response.data.map(routeData => new Route(routeData));
      setRoutes(routeModels);
    } catch (err) {
      console.error('Failed to load routes:', err);
    }
  };

  const handleToggleRouteStatus = async (routeId, currentStatus) => {
    try {
      await execute(() => AdminService.updateRouteStatus(routeId, { is_active: !currentStatus }));
      await loadRoutes();
    } catch (err) {
      console.error('Failed to update route status:', err);
    }
  };

  const RouteCard = ({ route }) => (
    <div className="card" style={{ marginBottom: 15 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 5px 0' }}>
            Route {route.routeNumber}: {route.routeName}
          </h4>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: 14 }}>
            {route.startStationName} → {route.endStationName}
          </p>
          <p style={{ margin: '0 0 5px 0', fontSize: 12, color: '#666' }}>
            Type: {route.getRouteTypeDisplay()} | 
            Distance: {route.totalDistance} km | 
            Duration: {route.getFormattedDuration()}
          </p>
          <p style={{ margin: '0', fontSize: 12, color: '#666' }}>
            Stations: {route.getTotalStations()} | 
            Base Fare: {formatCurrency(route.baseFare)} | 
            Per KM: {formatCurrency(route.farePerKm)}
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            padding: '4px 8px', 
            borderRadius: 4, 
            fontSize: 12,
            backgroundColor: route.isActive ? '#e8f5e8' : '#ffebee',
            color: route.isActive ? '#4caf50' : '#f44336',
            marginBottom: 5
          }}>
            {route.isActive ? 'Active' : 'Inactive'}
          </div>
          
          {route.isOperational() && (
            <div style={{ 
              padding: '4px 8px', 
              borderRadius: 4, 
              fontSize: 12,
              backgroundColor: '#e3f2fd',
              color: '#1976d2'
            }}>
              {route.assignedBuses.length} Buses
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 15, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button 
          className="btn btn-secondary"
          style={{ fontSize: 12, padding: '4px 8px' }}
          onClick={() => handleToggleRouteStatus(route.id, route.isActive)}
          disabled={loading}
        >
          {route.isActive ? 'Deactivate' : 'Activate'}
        </button>
        
        <button 
          className="btn btn-secondary"
          style={{ fontSize: 12, padding: '4px 8px' }}
          onClick={() => setSelectedRoute(route)}
        >
          View Details
        </button>
      </div>
    </div>
  );

  const AddRouteForm = () => {
    const [formData, setFormData] = useState({
      route_number: '',
      route_name: '',
      route_type: 'city',
      total_distance: 0,
      estimated_duration: 0,
      base_fare: 10,
      fare_per_km: 1.5,
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await execute(() => AdminService.createRoute(formData));
        setShowAddForm(false);
        await loadRoutes();
      } catch (err) {
        console.error('Failed to create route:', err);
      }
    };

    return (
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Create New Route</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Route Number</label>
              <input
                type="text"
                value={formData.route_number}
                onChange={(e) => setFormData({...formData, route_number: e.target.value})}
                placeholder="R001"
                required
              />
            </div>
            <div>
              <label>Route Name</label>
              <input
                type="text"
                value={formData.route_name}
                onChange={(e) => setFormData({...formData, route_name: e.target.value})}
                placeholder="City Center - Airport"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Route Type</label>
              <select
                value={formData.route_type}
                onChange={(e) => setFormData({...formData, route_type: e.target.value})}
              >
                <option value="city">City Route</option>
                <option value="intercity">Intercity</option>
                <option value="express">Express</option>
                <option value="local">Local</option>
              </select>
            </div>
            <div>
              <label>Distance (km)</label>
              <input
                type="number"
                value={formData.total_distance}
                onChange={(e) => setFormData({...formData, total_distance: parseFloat(e.target.value)})}
                min="0"
                step="0.1"
                required
              />
            </div>
            <div>
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={formData.estimated_duration}
                onChange={(e) => setFormData({...formData, estimated_duration: parseInt(e.target.value)})}
                min="0"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label>Base Fare (₹)</label>
              <input
                type="number"
                value={formData.base_fare}
                onChange={(e) => setFormData({...formData, base_fare: parseFloat(e.target.value)})}
                min="0"
                step="0.5"
                required
              />
            </div>
            <div>
              <label>Fare per KM (₹)</label>
              <input
                type="number"
                value={formData.fare_per_km}
                onChange={(e) => setFormData({...formData, fare_per_km: parseFloat(e.target.value)})}
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 15 }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Route'}
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
        <h2>Route Management</h2>
        <button 
          className="btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Route'}
        </button>
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      {showAddForm && <AddRouteForm />}

      {/* Route Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: 15,
        marginBottom: 20
      }}>
        <div className="stat-card">
          <h4>Total Routes</h4>
          <div className="stat-value">{routes.length}</div>
        </div>
        <div className="stat-card">
          <h4>Active Routes</h4>
          <div className="stat-value">{routes.filter(r => r.isActive).length}</div>
        </div>
        <div className="stat-card">
          <h4>Operational</h4>
          <div className="stat-value">{routes.filter(r => r.isOperational()).length}</div>
        </div>
      </div>

      {loading && (
        <div className="loading">Loading routes...</div>
      )}

      <div>
        {routes.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
            No routes found. Add your first route to get started.
          </div>
        ) : (
          routes.map(route => (
            <RouteCard key={route.id} route={route} />
          ))
        )}
      </div>

      {/* Route Details Modal */}
      {selectedRoute && (
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
            <h3>Route Details: {selectedRoute.routeNumber}</h3>
            <div style={{ marginBottom: 15 }}>
              <strong>Route Name:</strong> {selectedRoute.routeName}<br/>
              <strong>Type:</strong> {selectedRoute.getRouteTypeDisplay()}<br/>
              <strong>Start:</strong> {selectedRoute.startStationName}<br/>
              <strong>End:</strong> {selectedRoute.endStationName}<br/>
              <strong>Distance:</strong> {selectedRoute.totalDistance} km<br/>
              <strong>Duration:</strong> {selectedRoute.getFormattedDuration()}<br/>
              <strong>Base Fare:</strong> {formatCurrency(selectedRoute.baseFare)}<br/>
              <strong>Fare per KM:</strong> {formatCurrency(selectedRoute.farePerKm)}<br/>
              <strong>Total Stations:</strong> {selectedRoute.getTotalStations()}<br/>
              <strong>Assigned Buses:</strong> {selectedRoute.assignedBuses.length}<br/>
              <strong>Status:</strong> {selectedRoute.isActive ? 'Active' : 'Inactive'}<br/>
            </div>
            
            {selectedRoute.stations.length > 0 && (
              <div style={{ marginBottom: 15 }}>
                <strong>Stations:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: 20 }}>
                  {selectedRoute.stations.map((station, index) => (
                    <li key={index} style={{ fontSize: 14, marginBottom: 5 }}>
                      {station.stationName} ({station.distanceFromStart} km)
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedRoute(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;
