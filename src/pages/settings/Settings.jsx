import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {
  changeOrganizationPassword,
  getOrganizationProfile,
  updateOrganizationProfile,
} from '../../api/organization';
import { useAuth } from '../../context/useAuth';
import { useToast } from '../../context/useToast';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { getMobileError, MOBILE_LENGTH, sanitizeMobile } from '../../utils/validation';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROFILE_FIELDS = {
  orgEmail: 'Email is required.',
  orgName: 'Name is required.',
  orgAddress: 'Address is required.',
};

const validateProfile = (profile) => {
  const errors = {};
  Object.entries(PROFILE_FIELDS).forEach(([field, requiredMessage]) => {
    if (!profile[field].trim()) errors[field] = requiredMessage;
  });
  if (!errors.orgEmail && !EMAIL_PATTERN.test(profile.orgEmail.trim())) {
    errors.orgEmail = 'Please enter a valid email.';
  }
  const mobileError = getMobileError(profile.orgMobile);
  if (mobileError) errors.orgMobile = mobileError;
  return errors;
};

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('password'); // 'password' | 'profile'
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState('');
  // Fields show their error once edited or after a submit attempt.
  const [touchedProfileFields, setTouchedProfileFields] = useState({});
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
          orgAddress: organization.address || '',
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

  const profileErrors = validateProfile(profileData);
  const getProfileError = (field) =>
    touchedProfileFields[field] ? profileErrors[field] : undefined;
  const updateProfileField = (field, value) => {
    setProfileData((current) => ({ ...current, [field]: value }));
    setTouchedProfileFields((current) => ({ ...current, [field]: true }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setTouchedProfileFields({ orgEmail: true, orgName: true, orgAddress: true, orgMobile: true });
    if (Object.keys(profileErrors).length > 0) return;

    setIsSavingProfile(true);
    setProfileSuccessMessage('');
    try {
      const data = await updateOrganizationProfile(accessToken, {
        name: profileData.orgName.trim(),
        email: profileData.orgEmail.trim(),
        address: profileData.orgAddress.trim(),
        mobile: profileData.orgMobile.trim(),
      });
      const organization = data?.response;
      if (organization) {
        setProfileData((current) => ({
          orgEmail: organization.email ?? current.orgEmail,
          orgName: organization.name ?? current.orgName,
          orgAddress: organization.address ?? current.orgAddress,
          orgMobile: organization.mobile ?? current.orgMobile,
        }));
      }
      setProfileSuccessMessage(data?.message || 'Organization updated successfully');
      setTimeout(() => setProfileSuccessMessage(''), 3000);
    } catch (error) {
      showToast(error.message || 'Unable to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
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

              {profileSuccessMessage && (
                <div className="wetap-alert-success text-center mb-4 w-full">
                  {profileSuccessMessage}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="wetap-request-form" noValidate>
                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Email</label>
                  <input
                    type="email"
                    value={profileData.orgEmail}
                    onChange={(e) => updateProfileField('orgEmail', e.target.value)}
                    onBlur={() => setTouchedProfileFields((current) => ({ ...current, orgEmail: true }))}
                    aria-invalid={Boolean(getProfileError('orgEmail'))}
                    className="wetap-form-input"
                    disabled={isLoadingProfile || isSavingProfile}
                    required
                  />
                  {getProfileError('orgEmail') && (
                    <p className="wetap-field-error">{getProfileError('orgEmail')}</p>
                  )}
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Name</label>
                  <input
                    type="text"
                    value={profileData.orgName}
                    onChange={(e) => updateProfileField('orgName', e.target.value)}
                    onBlur={() => setTouchedProfileFields((current) => ({ ...current, orgName: true }))}
                    aria-invalid={Boolean(getProfileError('orgName'))}
                    className="wetap-form-input"
                    disabled={isLoadingProfile || isSavingProfile}
                    required
                  />
                  {getProfileError('orgName') && (
                    <p className="wetap-field-error">{getProfileError('orgName')}</p>
                  )}
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Address</label>
                  <input
                    type="text"
                    placeholder="Enter Organization Address"
                    value={profileData.orgAddress}
                    onChange={(e) => updateProfileField('orgAddress', e.target.value)}
                    onBlur={() => setTouchedProfileFields((current) => ({ ...current, orgAddress: true }))}
                    aria-invalid={Boolean(getProfileError('orgAddress'))}
                    className="wetap-form-input"
                    disabled={isLoadingProfile || isSavingProfile}
                  />
                  {getProfileError('orgAddress') && (
                    <p className="wetap-field-error">{getProfileError('orgAddress')}</p>
                  )}
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Mobile</label>
                  <input
                    type="text"
                    value={profileData.orgMobile}
                    inputMode="numeric"
                    maxLength={MOBILE_LENGTH}
                    placeholder="Enter 10 digit mobile number"
                    onChange={(e) => updateProfileField('orgMobile', sanitizeMobile(e.target.value))}
                    onBlur={() => setTouchedProfileFields((current) => ({ ...current, orgMobile: true }))}
                    aria-invalid={Boolean(getProfileError('orgMobile'))}
                    className="wetap-form-input"
                    disabled={isLoadingProfile || isSavingProfile}
                    required
                  />
                  {getProfileError('orgMobile') && (
                    <p className="wetap-field-error">{getProfileError('orgMobile')}</p>
                  )}
                </div>

                <div className="wetap-form-submit-wrapper mt-6">
                  <button
                    type="submit"
                    className="wetap-gradient-btn px-8"
                    disabled={isLoadingProfile || isSavingProfile}
                  >
                    {isSavingProfile ? 'Updating...' : 'Update Profile'}
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
