// Auth utility functions for frontend

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Check if user is authenticated
function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

// Get current user from localStorage
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Get auth token
function getAuthToken() {
  return localStorage.getItem('token');
}

// Verify token with backend
async function verifyAuthToken() {
  try {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    const res = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      // Update user info if changed
      localStorage.setItem('user', JSON.stringify(data.user));
      return true;
    } else {
      // Token is invalid, clear storage
      clearAuth();
      return false;
    }
  } catch (error) {
    console.error('Token verification error:', error);
    clearAuth();
    return false;
  }
}

// Logout - clear authentication data
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Clear authentication (internal use)
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Check authentication and redirect if needed
async function checkAuthAndRedirect() {
  if (!isAuthenticated()) {
    // User is not logged in, redirect to login
    window.location.href = 'login.html';
    return false;
  }

  // Verify token with backend
  const isValid = await verifyAuthToken();
  if (!isValid) {
    // Token is invalid, redirect to login
    window.location.href = 'login.html';
    return false;
  }

  return true;
}

// Check if first visit (no token) and redirect to login
function checkFirstVisit() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

// Get authorization header for API calls
function getAuthHeader() {
  return {
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  };
}
