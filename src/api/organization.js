import { request } from './client';

export const getOrganizationProfile = (token, signal) =>
  request('/api/organization/profile', { token, signal });

export const changeOrganizationPassword = (token, { oldPassword, newPassword }) =>
  request('/api/organization/change/password', {
    token,
    body: { oldPassword, newPassword },
  });
