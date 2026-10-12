import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('password'); // 'password' | 'profile'
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Password state
  const [oldPassword, setOldPassword] = useState('tester@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    orgEmail: 'tester@gmail.com',
    orgName: 'tester',
    orgAddress: '',
    orgMobile: '987643211',
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage('Password changed successfully!');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage('Profile updated successfully!');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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
                </div>

                <div className="wetap-form-submit-wrapper mt-6">
                  <button type="submit" className="wetap-gradient-btn px-8">
                    Change Password
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

              {submitted && (
                <div className="wetap-alert-success text-center mb-4 w-full">
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="wetap-request-form">
                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Email</label>
                  <input
                    type="email"
                    value={profileData.orgEmail}
                    onChange={(e) => setProfileData({ ...profileData, orgEmail: e.target.value })}
                    className="wetap-form-input"
                    required
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Name</label>
                  <input
                    type="text"
                    value={profileData.orgName}
                    onChange={(e) => setProfileData({ ...profileData, orgName: e.target.value })}
                    className="wetap-form-input"
                    required
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Address</label>
                  <input
                    type="text"
                    placeholder="Enter Organization Address"
                    value={profileData.orgAddress}
                    onChange={(e) => setProfileData({ ...profileData, orgAddress: e.target.value })}
                    className="wetap-form-input"
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Mobile</label>
                  <input
                    type="text"
                    value={profileData.orgMobile}
                    onChange={(e) => setProfileData({ ...profileData, orgMobile: e.target.value })}
                    className="wetap-form-input"
                    required
                  />
                </div>

                <div className="wetap-form-submit-wrapper mt-6">
                  <button type="submit" className="wetap-gradient-btn px-8">
                    Update Profile
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

