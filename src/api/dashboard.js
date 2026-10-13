import { request } from './client';

const chartEndpoints = {
  Users: '/api/dashboard/subscription',
  Cards: '/api/dashboard/card',
  Taps: '/api/dashboard/taps',
};

export const getDashboard = (token, signal) =>
  request('/api/dashboard', { token, signal });

export const getDashboardChart = (token, metric, { type, limit, text }, signal) => {
  const endpoint = chartEndpoints[metric];
  if (!endpoint) throw new Error(`Unsupported dashboard metric: ${metric}`);

  return request(endpoint, {
    token,
    query: { type, limit, text },
    signal,
  });
};

export const getDashboardUsers = (token, query, signal) =>
  request('/api/dashboard/users', { token, query, signal });

export const getDashboardCards = (token, query, signal) =>
  request('/api/dashboard/cards', { token, query, signal });
