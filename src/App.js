import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';

// Simple auth helpers using localStorage for scaffold/demo purposes
const auth = {
  isAuthenticated: () => !!localStorage.getItem('isAuth'),
  login: () => localStorage.setItem('isAuth', '1'),
  logout: () => localStorage.removeItem('isAuth'),
};

function RequireAuth({ children }) {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => auth.login()} />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Home onLogout={() => auth.logout()} />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

function App() {
  // force re-render on auth changes so navigation updates in demo
  // tick state tracks auth changes via storage events. it's intentionally unused directly.
  // eslint-disable-next-line no-unused-vars
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
