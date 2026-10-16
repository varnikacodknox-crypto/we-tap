import { request } from './client';

export const getOrganizationProfile = (token, signal) =>
  request('/api/organization/profile', { token, signal });

export const changeOrganizationPassword = (token, { oldPassword, newPassword }) =>
  request('/api/organization/change/password', {
    token,
    body: { oldPassword, newPassword },
  });

export const updateOrganizationProfile = (token, { name, email, address, mobile }) =>
  request('/api/organization', {
    token,
    method: 'PUT',
    body: { name, email, address, mobile },
  });
