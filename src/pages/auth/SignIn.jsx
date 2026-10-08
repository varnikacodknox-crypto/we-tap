import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import visibilityIcon from '../../assets/images/visibility.png';

export const SignIn = () => {
  const [email, setEmail] = useState('tester@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate('/main/dashboard');
  };

  return (
    <div className="wetap-auth-form-container">
      <h2 className="wetap-auth-title">Organization Log In</h2>

      <form onSubmit={handleSubmit} className="wetap-auth-form">
        <div className="wetap-form-group">
          <label className="wetap-form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="wetap-form-input"
            required
          />
        </div>

        <div className="wetap-form-group">
          <label className="wetap-form-label">Password</label>
          <div className="wetap-password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="wetap-form-input"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="wetap-password-toggle"
              aria-label="Toggle password visibility"
            >
              <img src={visibilityIcon} alt="Toggle Visibility" className="wetap-eye-icon" />
            </button>
          </div>
        </div>

        <div className="wetap-forgot-link-wrapper">
          <Link to="/signin/forgot-password" className="wetap-forgot-link">
            Forgot Password?
          </Link>
        </div>

        <div className="wetap-form-submit-wrapper">
          <button type="submit" className="wetap-gradient-btn">
            LOG IN
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
