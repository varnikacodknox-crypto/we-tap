import { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [customHeader, setCustomHeader] = useState(null);
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

  const outletContext = useMemo(() => ({ setCustomHeader }), []);
  const activeCustomHeader = location.pathname.includes('/users') ? customHeader : null;

  return (
    <div className="wetap-app-layout">
      <Sidebar isCollapsed={isCollapsed} />
      <div className={`wetap-main-container ${isCollapsed ? 'collapsed-sidebar' : ''}`}>
        <Header
          title={getPageTitle(location.pathname)}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          customHeader={activeCustomHeader}
        />
        <main className="wetap-content-area">
          <div key={location.pathname} className="wetap-page-transition">
            <Outlet context={outletContext} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
