import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { LogOut, ChevronLeft } from 'lucide-react';
import backWetapIcon from '../../assets/images/back_wetap.svg';
import AlertDialog from './AlertDialog';

export const Header = ({ title, isCollapsed, toggleSidebar, customHeader, rightContent }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);

  // The logout button only asks for confirmation; the session ends on "Yes, logout".
  const handleLogout = () => setIsConfirmingLogout(true);

  const confirmLogout = () => {
    setIsConfirmingLogout(false);
    logout();
    navigate('/signin', { replace: true, state: { loggedOut: true } });
  };

  const logoutDialog = (
    <AlertDialog
      open={isConfirmingLogout}
      variant="warning"
      title="Are you sure?"
      message="Do you really want to logout?"
      confirmLabel="Yes, logout"
      cancelLabel="Cancel"
      onConfirm={confirmLogout}
      onCancel={() => setIsConfirmingLogout(false)}
    />
  );

  // Extra header content (new UI only) sits just left of the logout button.
  const withRightContent = (logoutButton) =>
    rightContent ? (
      <div className="wtv2-header-right">
        {rightContent}
        {logoutButton}
      </div>
    ) : (
      logoutButton
    );

  if (customHeader) {
    return (
      <header className="wetap-header wetap-custom-header">
        <div className="wetap-header-left">
          {customHeader.onBack && (
            <button
              type="button"
              onClick={customHeader.onBack}
              className="wetap-header-back-btn"
              title="Back"
              aria-label="Back to Users"
            >
              <img src={backWetapIcon} alt="Back" />
            </button>
          )}
          {customHeader.title && (
            <h1 className="wetap-header-title">{customHeader.title}</h1>
          )}
        </div>
        {customHeader.showLogout && withRightContent(
          <button 
            className="wetap-logout-btn"
            onClick={handleLogout}
            title="Log Out"
          >
            <LogOut className="wetap-logout-icon" size={22} />
          </button>
        )}
        {logoutDialog}
      </header>
    );
  }

  return (
    <header className="wetap-header">
      <div className="wetap-header-left">
        <button
          onClick={toggleSidebar}
          className={`wetap-header-toggle-btn ${isCollapsed ? 'collapsed' : ''}`}
          aria-label="Toggle Sidebar"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronLeft
            size={18}
            className="wetap-chevron-icon-svg"
            color="#0f172a"
            strokeWidth={2.5}
          />
        </button>
        <h1 className="wetap-header-title">{title}</h1>
      </div>
      {withRightContent(
        <button 
          className="wetap-logout-btn"
          onClick={handleLogout}
          title="Log Out"
        >
          <LogOut className="wetap-logout-icon" size={22} />
        </button>
      )}
      {logoutDialog}
    </header>
  );
};

export default Header;
