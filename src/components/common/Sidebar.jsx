import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Import local image assets
import logo from '../../assets/images/wetapwelcome_logo.svg';
import dashboardActive from '../../assets/images/dashboard_selected.svg';
import dashboardInactive from '../../assets/images/dashboard_nonactive.svg';
import userActive from '../../assets/images/user_white.svg';
import userInactive from '../../assets/images/user-black.svg';
import cardActive from '../../assets/images/cards_white.svg';
import cardInactive from '../../assets/images/card.svg';
import reqActive from '../../assets/images/req_cards.svg';
import reqInactive from '../../assets/images/req_card.svg';
import placeActive from '../../assets/images/place_cards.svg';
import placeInactive from '../../assets/images/place_card.svg';
import settingActive from '../../assets/images/setting_white.svg';
import settingInactive from '../../assets/images/setting_black.svg';
import chevronIcon from '../../assets/images/chevron_sidebar.svg';

export const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/main/dashboard',
      activeIcon: dashboardActive,
      inactiveIcon: dashboardInactive,
    },
    {
      name: 'Users',
      path: '/main/users/list',
      activeIcon: userActive,
      inactiveIcon: userInactive,
    },
    {
      name: 'Cards',
      path: '/main/cards/list',
      activeIcon: cardActive,
      inactiveIcon: cardInactive,
    },
    {
      name: 'Request Card',
      path: '/main/request/list',
      activeIcon: reqActive,
      inactiveIcon: reqInactive,
    },
    {
      name: 'Place Card',
      path: '/main/placecard/list',
      activeIcon: placeActive,
      inactiveIcon: placeInactive,
    },
    {
      name: 'Settings',
      path: '/main/setting',
      activeIcon: settingActive,
      inactiveIcon: settingInactive,
    },
  ];

  return (
    <aside className={`wetap-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="wetap-sidebar-header">
        <div className="wetap-logo-container">
          <img src={logo} alt="WeTap Logo" className="wetap-brand-logo" />
        </div>
      </div>

      <nav className="wetap-sidebar-nav">
        <ul>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `wetap-nav-item ${isActive ? 'active' : ''}`
                  }
                  title={isCollapsed ? item.name : ''}
                >
                  <span className="wetap-nav-icon-wrapper">
                    <img
                      src={isActive ? item.activeIcon : item.inactiveIcon}
                      alt={item.name}
                      className="wetap-nav-icon"
                    />
                  </span>
                  {!isCollapsed && <span className="wetap-nav-label">{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle Button at Bottom Left */}
      <div className="wetap-sidebar-footer">
        <button
          onClick={toggleSidebar}
          className="wetap-sidebar-toggle-btn"
          aria-label="Toggle Sidebar"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <img
            src={chevronIcon}
            alt="Toggle"
            className={`wetap-chevron-icon ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
