import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import visibilityIcon from '../../assets/images/visibility.png';
import AlertDialog from '../../components/common/AlertDialog';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // Set by the header after "Yes, logout"; cleared on OK so a refresh doesn't show it again.
  const justLoggedOut = Boolean(location.state?.loggedOut);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/main/dashboard');
    } catch (loginError) {
      showToast(loginError.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wetap-auth-form-container">
      <AlertDialog
        open={justLoggedOut}
        variant="success"
        title="Logged out!"
        message="You have been successfully logged out."
        confirmLabel="OK"
        onConfirm={() => navigate(location.pathname, { replace: true, state: null })}
      />
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
              placeholder="Enter your password"
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
          <button type="submit" className="wetap-gradient-btn" disabled={isSubmitting}>
            {isSubmitting ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
