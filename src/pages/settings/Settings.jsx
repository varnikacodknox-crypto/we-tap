import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { changeOrganizationPassword, getOrganizationProfile } from '../../api/organization';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import LoadingIndicator from '../../components/common/LoadingIndicator';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('password'); // 'password' | 'profile'
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);
  const { accessToken } = useAuth();
  const showToast = useToast();
  const isLoadingProfile = !profileLoaded && !profileError;

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const showOldPassword = false;
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const passwordsMismatch = confirmPassword !== '' && newPassword !== confirmPassword;
  const canChangePassword =
    oldPassword !== '' &&
    newPassword !== '' &&
    confirmPassword !== '' &&
    !passwordsMismatch &&
    !isChangingPassword;

  // Profile state
  const [profileData, setProfileData] = useState({
    orgEmail: '',
    orgName: '',
    orgAddress: '',
    orgMobile: '',
  });

  useEffect(() => {
    const controller = new AbortController();

    getOrganizationProfile(accessToken, controller.signal)
      .then((data) => {
        const organization = data.organization;
        setProfileData({
          orgEmail: organization.email || '',
          orgName: organization.name || '',
          orgAddress: '',
          orgMobile: organization.mobile || '',
        });
        setProfileLoaded(true);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setProfileError(error.message);
          showToast(error.message);
        }
      });

    return () => controller.abort();
  }, [accessToken, showToast]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!canChangePassword) return;

    setIsChangingPassword(true);
    try {
      const data = await changeOrganizationPassword(accessToken, { oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSubmitMessage(data?.message || 'Password changed successfully!');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      showToast(error.message || 'Unable to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    showToast('Profile updates are unavailable because no update endpoint was provided.');
  };

  return (
    <div className="wetap-page-container">
      {/* Sub-Navigation Tabs */}
      <div className="wetap-request-tabs">
        <button
          className={`wetap-request-tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
        <button
          className={`wetap-request-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Edit Profile
        </button>
      </div>

      {/* TAB 1: Change Password */}
      {activeTab === 'password' && (
        <div key="password" className="wetap-page-transition">
          <div className="wetap-request-form-wrapper">
            <div className="wetap-request-card-box">
              <h3 className="wetap-request-box-title mb-6">Change Password</h3>

              {submitted && (
                <div className="wetap-alert-success text-center mb-4 w-full">
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="wetap-request-form">
                <div className="wetap-form-group">
                  <label className="wetap-form-label">Old Password</label>
                  <div className="wetap-password-input-wrapper">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="wetap-form-input"
                      required
                    />
                  </div>
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">New Password</label>
                  <div className="wetap-password-input-wrapper">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="wetap-form-input"
                      required
                    />
                    <button
                      type="button"
                      className="wetap-password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <Eye size={16} color="#94a3b8" /> : <EyeOff size={16} color="#94a3b8" />}
                    </button>
                  </div>
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Confirm Password</label>
                  <div className="wetap-password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Enter Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="wetap-form-input"
                      required
                    />
                    <button
                      type="button"
                      className="wetap-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <Eye size={16} color="#94a3b8" /> : <EyeOff size={16} color="#94a3b8" />}
                    </button>
                  </div>
                  {passwordsMismatch && (
                    <p className="wetap-password-mismatch">
                      New password and confirm password do not match.
                    </p>
                  )}
                </div>

                <div className="wetap-form-submit-wrapper mt-6">
                  <button
                    type="submit"
                    className="wetap-gradient-btn wetap-change-password-btn px-8"
                    disabled={!canChangePassword}
                  >
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Edit Profile */}
      {activeTab === 'profile' && (
        <div key="profile" className="wetap-page-transition">
          <div className="wetap-request-form-wrapper">
            <div className="wetap-request-card-box">
              <h3 className="wetap-request-box-title mb-6">Edit Profile</h3>

              {isLoadingProfile && (
                <LoadingIndicator label="Loading organization profile" />
              )}

              <form onSubmit={handleProfileSubmit} className="wetap-request-form">
                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Email</label>
                  <input
                    type="email"
                    value={profileData.orgEmail}
                    onChange={(e) => {
                      setProfileData({ ...profileData, orgEmail: e.target.value });
                    }}
                    className="wetap-form-input"
                    disabled={isLoadingProfile}
                    required
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Name</label>
                  <input
                    type="text"
                    value={profileData.orgName}
                    onChange={(e) => {
                      setProfileData({ ...profileData, orgName: e.target.value });
                    }}
                    className="wetap-form-input"
                    disabled={isLoadingProfile}
                    required
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Address</label>
                  <input
                    type="text"
                    placeholder="Enter Organization Address"
                    value={profileData.orgAddress}
                    onChange={(e) => {
                      setProfileData({ ...profileData, orgAddress: e.target.value });
                    }}
                    className="wetap-form-input"
                    disabled={isLoadingProfile}
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Mobile</label>
                  <input
                    type="text"
                    value={profileData.orgMobile}
                    onChange={(e) => {
                      setProfileData({ ...profileData, orgMobile: e.target.value });
                    }}
                    className="wetap-form-input"
                    disabled={isLoadingProfile}
                    required
                  />
                </div>

                <div className="wetap-form-submit-wrapper mt-6">
                  <button type="submit" className="wetap-gradient-btn px-8" disabled={isLoadingProfile}>
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
