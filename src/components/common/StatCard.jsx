import React from 'react';

export const StatCard = ({ title, value, icon, colorVariant = 'pink' }) => {
  return (
    <div className={`wetap-stat-card ${colorVariant}`}>
      <div className="wetap-stat-icon-container">
        <img src={icon} alt={title} className="wetap-stat-icon" />
      </div>
      <div className="wetap-stat-content">
        <span className="wetap-stat-title">{title}</span>
        <h3 className="wetap-stat-value">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
