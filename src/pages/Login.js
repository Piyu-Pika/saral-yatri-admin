import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await login(formData.username, formData.password);
      
      if (response.data && response.data.user) {
        if (onLogin) onLogin();
        // Redirect based on user role
        if (response.data.user.role === 'system_admin') {
          navigate('/');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="card login-card">
        <h2 style={{ marginTop: 0 }}>Admin Login</h2>
        <p style={{ color: '#666', marginBottom: 20 }}>Transport Management System</p>

        {error && (
          <div style={{ 
            color: '#f44336', 
            backgroundColor: '#ffebee', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Username</label>
            <input
              style={{ width: '100%', padding: 8, marginTop: 6 }}
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={loading}
              required
            />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input
              type="password"
              style={{ width: '100%', padding: 8, marginTop: 6 }}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          <div style={{ marginTop: 20 }}>
            <button 
              className="btn" 
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginBottom: 10 }}
            >
              {loading ? 'Logging in...' : 'Sign in'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => { 
                setFormData({ username: 'admin', password: 'admin123' }); 
                setError('');
              }}
              disabled={loading}
            >
              Fill demo credentials
            </button>
          </div>
        </form>

        <div style={{ marginTop: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#666' }}>Demo Credentials:</p>
          <p style={{ margin: '5px 0 0 0', fontSize: 12 }}><strong>Username:</strong> admin</p>
          <p style={{ margin: '2px 0 0 0', fontSize: 12 }}><strong>Password:</strong> admin123</p>
        </div>
      </div>
    </div>
  );
}
