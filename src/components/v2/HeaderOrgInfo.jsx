import useApiData from './useApiData';
import { getOrganizationProfile } from '../../api/organization';
import { useAuth } from '../../context/useAuth';
import '../../styles/v2.css';

const getInitials = (name = '') =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join('') || 'O';

// Organization name, logo and org code shown in the header next to logout (new UI only).
export const HeaderOrgInfo = () => {
  const { accessToken } = useAuth();
  const profile = useApiData(`profile|${accessToken}`, (signal) =>
    getOrganizationProfile(accessToken, signal)
  );
  const organization = profile.data?.organization;

  if (!organization) return null;

  return (
    <div className="wtv2-header-org">
        {organization.profilePic ? (
        <img src={organization.profilePic} alt="" className="wtv2-header-avatar is-image" />
      ) : (
        <div className="wtv2-header-avatar">{getInitials(organization.name)}</div>
      )}
       <div className="wtv2-header-org-text">
       <span className="wtv2-header-org-name">{organization.name}</span>
        {organization.email && (
          <span className="wtv2-header-org-email" title={organization.email}>{organization.email}</span>
        )}
        {organization.orgCode && (
          <span className="wtv2-header-org-code"><strong>{organization.orgCode}</strong></span>
        )}
      </div> 
    </div>
  );
};

export default HeaderOrgInfo;
