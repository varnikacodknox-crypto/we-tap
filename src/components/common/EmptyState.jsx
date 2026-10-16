import noRecordsImg from '../../assets/images/no.png';

export const EmptyState = ({ subtitle = '' }) => {
  return (
    <div className="wetap-empty-state">
      <div className="wetap-empty-icon-wrapper">
        <img src={noRecordsImg} alt="No Records" className="wetap-empty-img" />
      </div>
      {subtitle && <p className="wetap-empty-subtitle">{subtitle}</p>}
    </div>
  );
};

export default EmptyState;
