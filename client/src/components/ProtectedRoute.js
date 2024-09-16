import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../services/AuthService';

const ProtectedRoute = ({ element: Element }) => {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Element />;
};

export default ProtectedRoute;
