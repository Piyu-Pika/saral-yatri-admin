import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import AdminService from '../services/adminService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    subsidyEligible: 0,
    pending: 0
  });
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      // Try to get users from admin endpoint
      const response = await execute(() => AdminService.getAllUsers());
      const userData = response.data || [];
      setUsers(userData);
      setFilteredUsers(userData);
      
      // Calculate stats
      setStats({
        total: userData.length,
        verified: userData.filter(u => u.is_verified).length,
        subsidyEligible: userData.filter(u => u.subsidy_eligible).length,
        pending: userData.filter(u => !u.is_verified).length
      });
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  const handleVerifyUser = async (userId, verificationData) => {
    try {
      await execute(() => AdminService.verifyUser({
        user_id: userId,
        ...verificationData
      }));
      await loadUsers();
      setShowVerifyForm(false);
      setSelectedUser(null);
      alert('User verified successfully!');
    } catch (err) {
      console.error('Failed to verify user:', err);
    }
  };

  const VerifyUserForm = ({ user, onClose }) => {
    const [formData, setFormData] = useState({
      verification_type: 'aadhaar',
      document_number: '',
      verification_status: 'verified',
      remarks: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleVerifyUser(user.id, formData);
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
        zIndex: 1000,
        padding: '20px'
      }}>
        <div className="card" style={{ maxWidth: 600, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
          <h3>Verify User: {user.username}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 15 }}>
              <label>Verification Type *</label>
              <select
                value={formData.verification_type}
                onChange={(e) => setFormData({...formData, verification_type: e.target.value})}
                required
                style={{ width: '100%' }}
              >
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="voter_id">Voter ID</option>
                <option value="driving_license">Driving License</option>
                <option value="passport">Passport</option>
                <option value="student_id">Student ID</option>
                <option value="senior_citizen_card">Senior Citizen Card</option>
                <option value="disability_certificate">Disability Certificate</option>
              </select>
            </div>

            <div style={{ marginBottom: 15 }}>
              <label>Document Number *</label>
              <input
                type="text"
                value={formData.document_number}
                onChange={(e) => setFormData({...formData, document_number: e.target.value})}
                placeholder="Enter document number"
                required
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label>Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                rows={3}
                placeholder="Add verification notes..."
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify User'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Management</h2>

      {/* Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 15,
        marginTop: 20,
        marginBottom: 30
      }}>
        <div className="stat-card">
          <h4>Total Users</h4>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h4>Verified Users</h4>
          <div className="stat-value">{stats.verified}</div>
        </div>
        <div className="stat-card">
          <h4>Subsidy Eligible</h4>
          <div className="stat-value">{stats.subsidyEligible}</div>
        </div>
        <div className="stat-card">
          <h4>Pending Verification</h4>
          <div className="stat-value">{stats.pending}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Search Users</h3>
        <input
          type="text"
          placeholder="Search by username, email, name, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '14px' }}
        />
      </div>

      {error && (
        <div style={{ color: '#f44336', marginBottom: 15, padding: 10, backgroundColor: '#ffebee', borderRadius: 4 }}>
          {error}
        </div>
      )}

      {/* Users List */}
      <div className="card">
        <h3>All Users ({filteredUsers.length})</h3>
        
        {loading && users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20 }}>Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
            {searchTerm ? 'No users found matching your search.' : 'No users registered yet.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Username</th>
                  <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Full Name</th>
                  <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                  <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Phone</th>
                  <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Role</th>
                  <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid #ddd' }}>Status</th>
                  <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{user.username}</td>
                    <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{user.full_name || '-'}</td>
                    <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{user.email}</td>
                    <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{user.phone || '-'}</td>
                    <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: 3,
                        fontSize: 11,
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: 10, borderBottom: '1px solid #eee', textAlign: 'center' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: 3,
                        fontSize: 11,
                        backgroundColor: user.is_verified ? '#e8f5e8' : '#fff3e0',
                        color: user.is_verified ? '#4caf50' : '#ff9800'
                      }}>
                        {user.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: 10, borderBottom: '1px solid #eee', textAlign: 'center' }}>
                      {!user.is_verified && (
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: 11, padding: '4px 8px' }}
                          onClick={() => {
                            setSelectedUser(user);
                            setShowVerifyForm(true);
                          }}
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verify User Modal */}
      {showVerifyForm && selectedUser && (
        <VerifyUserForm 
          user={selectedUser} 
          onClose={() => {
            setShowVerifyForm(false);
            setSelectedUser(null);
          }} 
        />
      )}
    </div>
  );
};

export default UserManagement;
