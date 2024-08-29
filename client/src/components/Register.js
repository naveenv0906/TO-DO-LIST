import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

const Register = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/register`, { email, password });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      setSuccess('Registration successful');
      setError(null);
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.includes('User already exists')) {
          setError('User already exists. Please use a different email.');
        } else {
          setError('Error during registration. Please try again.');
        }
      } else {
        setError('Error during registration. Please try again.');
      }
      setSuccess(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="row justify-content-center w-100">
        <div className="col-md-4">
          <div className="card shadow-lg p-4 bg-white rounded" style={{ height: '300px', width: '400px' }}>
            <h2 className="text-center mb-4">Register</h2>
            <div className="form-group">
              <input
                type="email"
                className="form-control mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <div className="input-group mb-3">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              <button onClick={handleRegister} className="btn btn-primary w-100">
                Register
              </button>
              {success && <p className="mt-3 text-success">{success}</p>}
              {error && <p className="mt-3 text-danger">{error}</p>}
              <p className="mt-3 text-center">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
