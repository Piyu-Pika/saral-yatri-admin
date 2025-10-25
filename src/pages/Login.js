import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    // very small stub: accept any non-empty creds
    if (email && password) {
      if (onLogin) onLogin();
      localStorage.setItem('isAuth', '1');
      navigate('/');
    } else {
      alert('Please provide email and password (demo)');
    }
  }

  return (
    <div className="login-wrapper">
      <div className="card login-card">
        <h2 style={{ marginTop: 0 }}>Admin Login</h2>

        <form onSubmit={submit}>
          <div className="form-row">
            <label>Email</label>
            <input
              style={{ width: '100%', padding: 8, marginTop: 6 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input
              type="password"
              style={{ width: '100%', padding: 8, marginTop: 6 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <button className="btn" type="submit">Sign in</button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginLeft: 8 }}
              onClick={() => { setEmail('admin@example.com'); setPassword('password'); }}
            >
              Fill demo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
