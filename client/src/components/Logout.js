// src/components/Logout.js
import React from 'react';
import { logout } from '../services/AuthService';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Logout.css'; // Custom CSS for animations

const Logout = ({ onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <button
        onClick={handleLogout}
        className="btn btn-danger btn-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
