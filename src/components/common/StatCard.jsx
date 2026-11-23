import { Link } from 'react-router-dom';

// Pass `to` to link to a list page, or `onClick` for an in-page action.
export const StatCard = ({ title, value, icon, colorVariant = 'pink', to, onClick }) => {
  const className = `wetap-stat-card wetap-stat-card--action ${colorVariant}`;
  const content = (
    <>
      <span className="wetap-stat-icon-container">
        <img src={icon} alt="" className="wetap-stat-icon" />
      </span>
      <span className="wetap-stat-content">
        <span className="wetap-stat-title">{title}</span>
        <span className="wetap-stat-value">{value}</span>
      </span>
    </>
  );
  return to ? (
    <Link to={to} className={className}>{content}</Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>{content}</button>
  );
};

export default StatCard;
