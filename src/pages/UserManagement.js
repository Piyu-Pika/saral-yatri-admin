import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';
import { User } from '../models/User';
import { formatDate } from '../utils/helpers';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await execute(() => AdminService.getAllUsers());
      const userModels = response.data.map(userData => new User(userData));
      setUsers(userModels);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await execute(() => AdminService.verifyUser(userId));
      await loadUsers();
    } catch (err) {
      console.error('Failed to verify user:', err);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await execute(() => AdminService.updateUserStatus(userId, { is_active: !currentStatus }));
      await loadUsers();
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || 
      (filter === 'verified' && user.isVerified) ||
      (filter === 'unverified' && !user.isVerified) ||
      (filter === 'subsidy' && user.subsidyEligible);
    
    const matchesSearch = !searchTerm || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  });

  const UserCard = ({ user }) => (
    <div className="card" style={{ marginBottom: 15 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 5px 0' }}>{user.username}</h4>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: 14 }}>
            {user.email} | {user.phone}
          </p>
          <p style={{ margin: '0 0 5px 0', fontSize: 12, color: '#666' }}>
            Role: {user.role.replace('_', ' ').toUpperCase()} | 
            Joined: {user.getFormattedCreatedAt()}
            {user.dateOfBirth && ` | Age: ${user.getAge()}`}
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            padding: '4px 8px', 
            borderRadius: 4, 
            fontSize: 12,
            backgroundColor: user.isVerified ? '#e8f5e8' : '#fff3e0',
            color: user.isVerified ? '#4caf50' : '#ff9800',
            marginBottom: 5
          }}>
            {user.isVerified ? 'Verified' : 'Unverified'}
          </div>
          
          {user.subsidyEligible && (
            <div style={{ 
              padding: '4px 8px', 
              borderRadius: 4, 
              fontSize: 12,
              backgroundColor: '#e3f2fd',
              color: '#1976d2'
            }}>
              Subsidy Eligible
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 15, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {!user.isVerified && (
          <button 
            className="btn"
            style={{ fontSize: 12, padding: '4px 8px' }}
            onClick={() => handleVerifyUser(user.id)}
            disabled={loading}
          >
            Verify User
          </button>
        )}
        
        <button 
          className="btn btn-secondary"
          style={{ fontSize: 12, padding: '4px 8px' }}
          onClick={() => handleToggleUserStatus(user.id, user.isActive)}
          disabled={loading}
        >
          {user.isActive ? 'Deactivate' : 'Activate'}
        </button>
        
        <button 
          className="btn btn-secondary"
          style={{ fontSize: 12, padding: '4px 8px' }}
          onClick={() => setSelectedUser(user)}
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>User Management</h2>

      {/* Filters and Search */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 15, flexWrap: 'wrap' }}>
        <div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px 12px', fontSize: 14 }}
          >
            <option value="all">All Users</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
            <option value="subsidy">Subsidy Eligible</option>
          </select>
        </div>
        
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', fontSize: 14 }}
          />
        </div>
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      {loading && (
        <div className="loading">Loading users...</div>
      )}

      {/* User Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: 15,
        marginBottom: 20
      }}>
        <div className="stat-card">
          <h4>Total Users</h4>
          <div className="stat-value">{users.length}</div>
        </div>
        <div className="stat-card">
          <h4>Verified</h4>
          <div className="stat-value">{users.filter(u => u.isVerified).length}</div>
        </div>
        <div className="stat-card">
          <h4>Subsidy Eligible</h4>
          <div className="stat-value">{users.filter(u => u.subsidyEligible).length}</div>
        </div>
      </div>

      {/* User List */}
      <div>
        {filteredUsers.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
            No users found matching your criteria.
          </div>
        ) : (
          filteredUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
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
            <h3>User Details</h3>
            <div style={{ marginBottom: 15 }}>
              <strong>Username:</strong> {selectedUser.username}<br/>
              <strong>Email:</strong> {selectedUser.email}<br/>
              <strong>Phone:</strong> {selectedUser.phone}<br/>
              <strong>Role:</strong> {selectedUser.role}<br/>
              <strong>Verified:</strong> {selectedUser.isVerified ? 'Yes' : 'No'}<br/>
              <strong>Active:</strong> {selectedUser.isActive ? 'Yes' : 'No'}<br/>
              <strong>Joined:</strong> {selectedUser.getFormattedCreatedAt()}<br/>
              {selectedUser.dateOfBirth && (
                <>
                  <strong>Date of Birth:</strong> {formatDate(selectedUser.dateOfBirth)}<br/>
                  <strong>Age:</strong> {selectedUser.getAge()} years<br/>
                </>
              )}
              <strong>Subsidy Eligible:</strong> {selectedUser.subsidyEligible || 'None'}<br/>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
