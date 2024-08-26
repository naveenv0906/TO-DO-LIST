// AuthService.js
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Register a new user
export const register = (email, password) => {
  return axios.post(`${backendUrl}/api/register`, { email, password });
};

// Log in an existing user
export const login = (email, password) => {
  return axios.post(`${backendUrl}/api/login`, { email, password });
};

// Log out the current user
export const logout = () => {
  sessionStorage.removeItem('authToken'); // Remove the auth token
};

// Get the stored token
export const getToken = () => {
  return sessionStorage.getItem('authToken'); // Retrieve the auth token
};

// Set the token in session storage
export const setToken = (token) => {
  sessionStorage.setItem('authToken', token); // Store the auth token
};
