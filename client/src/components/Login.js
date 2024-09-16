import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, setToken } from '../services/AuthService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      setToken(response.data.token);
      setSuccess('Login successful!');

      setTimeout(() => navigate('/todos'), 1500);
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="row justify-content-center w-100">
        <div className="col-md-4">
          <div className="card shadow-lg p-4 bg-white rounded" style={{ height: '300px', width: '400px' }}>
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                {/* Email input */}
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  name="email_field"
                  autoComplete="off" // Prevents autofill from browser
                />
                {/* Password input with show/hide functionality */}
                <div className="input-group mb-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    name="password_field"
                    autoComplete="new-password" // Prevents password autofill
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>
                {/* Submit button */}
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </div>

              {/* Success or Error Messages */}
              {success && <div className="alert alert-success mt-3">{success}</div>}
              {error && <div className="alert alert-danger mt-3">{error}</div>}

              {/* Registration link */}
              <p className="mt-3 text-center">
                Don't have an account? <Link to="/register">Create one here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
