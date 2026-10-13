import axios from 'axios';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://apiwetap.codknox.com'
).replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
});

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let unauthorizedHandler = null;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const handleUnauthorized = (status, token) => {
  // Only authenticated requests end the session; a 401 from login means bad credentials.
  if (status === 401 && token) unauthorizedHandler?.();
};

export const apiUrl = (path) => `${API_BASE_URL}${path}`;

export const request = async (path, { token, query, body, method, signal } = {}) => {
  let response;
  try {
    response = await apiClient.request({
      url: path,
      method: method || (body === undefined ? 'GET' : 'POST'),
      params: query,
      data: body,
      signal,
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { authorization: token } : {}),
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const payload = error.response?.data;
      handleUnauthorized(error.response?.status, token);
      throw new ApiError(
        payload?.data?.message || payload?.message || error.message,
        error.response?.status
      );
    }
    throw error;
  }
  const payload = response.data;

  if (payload.statusCode && payload.statusCode >= 400) {
    handleUnauthorized(payload.statusCode, token);
    throw new ApiError(
      payload.data?.message || payload.message || `Request failed (${response.status})`,
      payload.statusCode
    );
  }

  return payload.data;
};
