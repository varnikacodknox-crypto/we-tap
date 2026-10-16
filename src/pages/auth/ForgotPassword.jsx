import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import { useToast } from '../../context/useToast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await forgotPassword(email.trim());
      setSuccessMessage(data?.message || 'Reset link sent! Please check your email inbox.');
    } catch (error) {
      showToast(error.message || 'Unable to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wetap-auth-form-container">
      <h2 className="wetap-auth-title">Forgot Password?</h2>
      <p className="wetap-auth-subtitle">
        Enter registered email address.<br />
        We'll send you an email to reset your password.
      </p>

      {successMessage ? (
        <div className="wetap-success-notice">
          <p>{successMessage}</p>
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
            <button type="submit" className="wetap-gradient-btn" disabled={isSubmitting}>
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
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
