import { Outlet } from 'react-router-dom';
import logo from '../../assets/images/wetapwelcome_logo.svg';
import newLoginImg from '../../assets/images/wetap_newlogin.png';

export const AuthLayout = () => {
  return (
    <div className="wetap-auth-page">
      {/* Left Decorative Section with wetap_newlogin.png */}
      <div className="wetap-auth-left">
        <div className="wetap-cards-stage-img-wrapper">
          <img
            src={newLoginImg}
            alt="Wetap Card Banner"
            className="wetap-new-login-banner"
          />
        </div>
      </div>

      {/* Right Form Section */}
      <div className="wetap-auth-right">
        <div className="wetap-auth-card">
          <div className="wetap-auth-header">
            <img src={logo} alt="WeTap Logo" className="wetap-auth-logo" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
