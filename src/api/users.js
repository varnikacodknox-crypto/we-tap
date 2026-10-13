import { request } from './client';

export const getUsers = (token, { limit = 5, offset = 0 } = {}, signal) =>
  request('/api/user/list', {
    token,
    query: { limit, offset },
    signal,
  });

export const updateUserStatus = (token, userId, status) =>
  request('/api/user/update', {
    token,
    method: 'PUT',
    body: { userId, status },
  });

export const updateUserDetails = (token, { userId, name, email }) =>
  request('/api/user/update', {
    token,
    method: 'PUT',
    body: { userId, name, email },
  });

export const assignUserSubscription = (token, subscription) =>
  request('/api/subscription/assign', {
    token,
    method: 'POST',
    body: subscription,
  });

export const cancelUserSubscription = (token, userId) =>
  request('/api/subscription/assign', {
    token,
    method: 'POST',
    body: { userId, status: 'canceled' },
  });
