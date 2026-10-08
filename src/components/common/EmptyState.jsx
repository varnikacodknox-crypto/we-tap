import React from 'react';
import noRecordsImg from '../../assets/images/no.png';

export const EmptyState = ({ message = 'No Records Found', subtitle = '' }) => {
  return (
    <div className="wetap-empty-state">
      <div className="wetap-empty-icon-wrapper">
        <img src={noRecordsImg} alt="No Records" className="wetap-empty-img" />
      </div>
      {/* <p className="wetap-empty-title">{message}</p> */}
      {subtitle && <p className="wetap-empty-subtitle">{subtitle}</p>}
    </div>
  );
};

export default EmptyState;
