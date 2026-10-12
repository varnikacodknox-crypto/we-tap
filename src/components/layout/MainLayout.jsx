import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <Sidebar isCollapsed={isCollapsed} />
      <div className={`wetap-main-container ${isCollapsed ? 'collapsed-sidebar' : ''}`}>
        <Header
          title={getPageTitle(location.pathname)}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
        />
        <main className="wetap-content-area">
          <div key={location.pathname} className="wetap-page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
