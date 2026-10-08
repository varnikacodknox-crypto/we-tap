import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Building, ShieldCheck, Bell, Save } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('organization');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [orgData, setOrgData] = useState({
    orgName: 'WeTap Enterprise',
    orgEmail: 'admin@wetap.com',
    phone: '+1 (555) 234-5678',
    address: '100 Innovation Way, Suite 400, San Francisco, CA',
    website: 'https://orgwetap.codknox.com',
    allowPublicQr: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="wetap-page-container">
      <div className="wetap-settings-layout">
        {/* Settings Sub-Sidebar Tabs */}
        <div className="wetap-settings-nav">
          <button
            className={`wetap-settings-nav-item ${activeTab === 'organization' ? 'active' : ''}`}
            onClick={() => setActiveTab('organization')}
          >
            <Building size={18} />
            <span>Organization Profile</span>
          </button>
          <button
            className={`wetap-settings-nav-item ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <User size={18} />
            <span>Account Details</span>
          </button>
          <button
            className={`wetap-settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <ShieldCheck size={18} />
            <span>Security & Passwords</span>
          </button>
          <button
            className={`wetap-settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
        </div>

        {/* Settings Form Content */}
        <div className="wetap-settings-content">
          {savedSuccess && (
            <div className="wetap-alert-success">
              Settings updated successfully!
            </div>
          )}

          {activeTab === 'organization' && (
            <form onSubmit={handleSave} className="wetap-settings-form">
              <h3 className="wetap-settings-section-title">Organization Settings</h3>
              
              <div className="wetap-form-grid">
                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Name</label>
                  <input
                    type="text"
                    value={orgData.orgName}
                    onChange={(e) => setOrgData({ ...orgData, orgName: e.target.value })}
                    className="wetap-form-input"
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Organization Email</label>
                  <input
                    type="email"
                    value={orgData.orgEmail}
                    onChange={(e) => setOrgData({ ...orgData, orgEmail: e.target.value })}
                    className="wetap-form-input"
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Support Phone</label>
                  <input
                    type="text"
                    value={orgData.phone}
                    onChange={(e) => setOrgData({ ...orgData, phone: e.target.value })}
                    className="wetap-form-input"
                  />
                </div>

                <div className="wetap-form-group">
                  <label className="wetap-form-label">Website URL</label>
                  <input
                    type="text"
                    value={orgData.website}
                    onChange={(e) => setOrgData({ ...orgData, website: e.target.value })}
                    className="wetap-form-input"
                  />
                </div>

                <div className="wetap-form-group full-width">
                  <label className="wetap-form-label">Headquarters Address</label>
                  <textarea
                    rows={3}
                    value={orgData.address}
                    onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
                    className="wetap-form-input"
                  />
                </div>
              </div>

              <div className="wetap-form-submit-wrapper left-align">
                <button type="submit" className="wetap-gradient-btn flex items-center gap-2">
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'account' && (
            <form onSubmit={handleSave} className="wetap-settings-form">
              <h3 className="wetap-settings-section-title">Admin Account Info</h3>
              <div className="wetap-form-grid">
                <div className="wetap-form-group">
                  <label className="wetap-form-label">Admin Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || 'Tester Admin'}
                    className="wetap-form-input"
                  />
                </div>
                <div className="wetap-form-group">
                  <label className="wetap-form-label">Admin Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || 'tester@gmail.com'}
                    className="wetap-form-input"
                    disabled
                  />
                </div>
              </div>
              <div className="wetap-form-submit-wrapper left-align">
                <button type="submit" className="wetap-gradient-btn flex items-center gap-2">
                  <Save size={18} />
                  <span>Update Account</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSave} className="wetap-settings-form">
              <h3 className="wetap-settings-section-title">Security & Password</h3>
              <div className="wetap-form-grid">
                <div className="wetap-form-group full-width">
                  <label className="wetap-form-label">Current Password</label>
                  <input type="password" placeholder="••••••••" className="wetap-form-input" />
                </div>
                <div className="wetap-form-group">
                  <label className="wetap-form-label">New Password</label>
                  <input type="password" placeholder="New Password" className="wetap-form-input" />
                </div>
                <div className="wetap-form-group">
                  <label className="wetap-form-label">Confirm New Password</label>
                  <input type="password" placeholder="Confirm Password" className="wetap-form-input" />
                </div>
              </div>
              <div className="wetap-form-submit-wrapper left-align">
                <button type="submit" className="wetap-gradient-btn flex items-center gap-2">
                  <ShieldCheck size={18} />
                  <span>Update Security</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="wetap-settings-form">
              <h3 className="wetap-settings-section-title">Notification Preferences</h3>
              <div className="space-y-4">
                <label className="wetap-checkbox-row">
                  <input type="checkbox" defaultChecked />
                  <span>Receive email alert whenever a new NFC card is requested</span>
                </label>
                <label className="wetap-checkbox-row">
                  <input type="checkbox" defaultChecked />
                  <span>Receive weekly summary report of card taps and active users</span>
                </label>
                <label className="wetap-checkbox-row">
                  <input type="checkbox" defaultChecked />
                  <span>Security & System Maintenance Alerts</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
