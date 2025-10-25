// Authentication Service
import ApiService from './api';

class AuthService {
  // Login user
  async login(username, password) {
    try {
      const response = await ApiService.post('/auth/login', {
        username,
        password,
      });

      if (response.data && response.data.token) {
        // Store token and user data
        ApiService.setToken(response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        localStorage.setItem('tokenExpiry', response.data.expires_at);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  logout() {
    ApiService.removeToken();
    localStorage.removeItem('userData');
    localStorage.removeItem('tokenExpiry');
  }

  // Get current user data
  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) {
      return false;
    }

    // Check if token is expired
    const expiryDate = new Date(expiry);
    const now = new Date();
    
    if (now >= expiryDate) {
      this.logout();
      return false;
    }

    return true;
  }

  // Check if user has admin role
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'system_admin';
  }

  // Refresh token if needed
  async refreshToken() {
    try {
      const response = await ApiService.post('/auth/refresh');
      if (response.data && response.data.token) {
        ApiService.setToken(response.data.token);
        localStorage.setItem('tokenExpiry', response.data.expires_at);
      }
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

export default new AuthService();