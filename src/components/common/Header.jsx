import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export const Header = ({ title }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <header className="wetap-header">
      <div className="wetap-header-title-container">
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
