import { request } from './client';

export const getPhysicalCards = (token, { limit = 5, offset = 0 } = {}, signal) =>
  request('/api/card/physicalCards', {
    token,
    query: { limit, offset },
    signal,
  });
