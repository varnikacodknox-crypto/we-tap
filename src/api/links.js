import { request } from './client';

export const getLinkAuditLogs = (token, { linkAddedId, cardId }, signal) =>
  request('/api/link/linkAudit', {
    token,
    method: 'POST',
    body: { linkAddedId, cardId },
    signal,
  });

export const updateLink = (token, { cardId, link, linkaddedId, userTitle }, signal) =>
  request('/api/link/added', {
    token,
    method: 'PUT',
    body: { cardId, link, linkaddedId, userTitle },
    signal,
  });

export const getCardLinks = (token, cardId, signal) =>
  request('/api/link', {
    token,
    query: { cardId },
    signal,
  });

