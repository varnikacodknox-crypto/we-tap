import { request } from './client';

export const login = (email, password) =>
  request('/api/organization/login', { body: { email, password } });
