import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/users')) return 'User';
    if (path.includes('/cards')) return 'Cards';
    if (path.includes('/request')) return 'Request Card';
    if (path.includes('/placecard')) return 'Place Card';
    if (path.includes('/setting')) return 'Setting';
    return 'Dashboard';
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="wetap-app-layout">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className={`wetap-main-container ${isCollapsed ? 'collapsed-sidebar' : ''}`}>
        <Header title={getPageTitle(location.pathname)} />
        <main className="wetap-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
