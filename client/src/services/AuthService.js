import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export const register = (email, password) => {
  return axios.post(`${backendUrl}/api/register`, { email, password });
};

export const login = (email, password) => {
  return axios.post(`${backendUrl}/api/login`, { email, password });
};

export const logout = () => {
  sessionStorage.removeItem('authToken'); // Remove the auth token
};

export const getToken = () => {
  return sessionStorage.getItem('authToken'); 
};

export const setToken = (token) => {
  sessionStorage.setItem('authToken', token);
};
