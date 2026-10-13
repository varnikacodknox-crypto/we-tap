import { createPortal } from 'react-dom';
import loader from '../../assets/images/wetap_loader_latest.gif';

const LoadingIndicator = ({ label = 'Loading' }) =>
  createPortal(
    <div className="wetap-loading-indicator" role="status" aria-label={label}>
      <img src={loader} alt="" />
    </div>,
    document.body
  );

export default LoadingIndicator;
