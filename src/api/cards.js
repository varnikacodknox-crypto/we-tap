import { request } from './client';

export const getPhysicalCards = (token, { limit = 5, offset = 0 } = {}, signal) =>
  request('/api/card/physicalCards', {
    token,
    query: { limit, offset },
    signal,
  });

export const getRequestedCards = (token, { limit = 5, offset = 0 } = {}, signal) =>
  request('/api/card/requestedCardAccess', {
    token,
    query: { limit, offset },
    signal,
  });

export const getUserCards = (token, userId, signal) =>
  request('/api/card', {
    token,
    query: { userId },
    signal,
  });

