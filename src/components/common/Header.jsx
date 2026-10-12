import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ChevronLeft } from 'lucide-react';

export const Header = ({ title, isCollapsed, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

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
      <button 
        className="wetap-logout-btn"
        onClick={handleLogout}
        title="Log Out"
      >
        <LogOut className="wetap-logout-icon" size={22} />
      </button>
    </header>
  );
};

export default Header;
