import { request } from './client';

export const getOrders = (token, { limit = 10, offset = 0 } = {}, signal) =>
  request('/api/orders/list', {
    token,
    query: { limit, offset },
    signal,
  });

export const createOrder = (token, order) =>
  request('/api/orders', {
    token,
    body: order,
  });
