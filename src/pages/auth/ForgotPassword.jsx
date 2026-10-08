import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="wetap-auth-form-container">
      <h2 className="wetap-auth-title">Forgot Password?</h2>
      <p className="wetap-auth-subtitle">
        Enter registered email address.<br />
        We'll send you an email to reset your password.
      </p>

      {submitted ? (
        <div className="wetap-success-notice">
          <p>Reset link sent! Please check your email inbox.</p>
          <Link to="/signin" className="wetap-back-login-btn">
            Back to Log In ?
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="wetap-auth-form">
          <div className="wetap-form-group">
            <label className="wetap-form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="wetap-form-input"
              required
            />
          </div>

          <div className="wetap-form-submit-wrapper">
            <button type="submit" className="wetap-gradient-btn">
              SUBMIT
            </button>
          </div>

          <div className="wetap-back-link-wrapper">
            <Link to="/signin" className="wetap-back-login-btn">
              Back to Log In ?
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
