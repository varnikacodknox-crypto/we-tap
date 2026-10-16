import { useEffect, useState } from 'react';
import { login as loginRequest } from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';
import { AuthContext } from './authContextInstance';

const STORAGE_KEYS = ['token', 'role', 'browserDetail', 'activeIndex'];

const getBrowserDetail = () => {
  const agent = navigator.userAgent;
  const browers = [
    ['Edge', /Edg\/(\d+)/],
    ['Opera', /OPR\/(\d+)/],
    ['Chrome', /Chrome\/(\d+)/],
    ['Firefox', /Firefox\/(\d+)/],
    ['Safari', /Version\/(\d+).*Safari/],
  ];
  for (const [name, pattern] of browsers) {
    const match = agent.match(pattern);
    if (match) return `${name} ${match[1]}`;
  }
  return 'Unknown';
};

const getTokenRole = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).role;
  } catch {
    return undefined;
  }
};

const readStoredToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

const storeSession = (account) => {
  try {
    if (account) {
      localStorage.setItem('token', account.accessToken);
      localStorage.setItem('role', account.role || getTokenRole(account.accessToken) || 'org');
      localStorage.setItem('browserDetail', getBrowserDetail());
      localStorage.setItem('activeIndex', '0');
    } else {
      STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    }
  } catch {
    // Storage can be unavailable (e.g. private mode); the session still works until refresh.
  }
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(readStoredToken);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    const account = data?.response;

    if (!account?.accessToken) {
      throw new Error('The login response did not include an access token.');
    }

    storeSession(account);
    setAccessToken(account.accessToken);
    setUser(account);
  };

  const logout = () => {
    storeSession(null);
    setAccessToken(null);
    setUser(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      storeSession(null);
      setAccessToken(null);
      setUser(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      accessToken,
      isAuthenticated: Boolean(accessToken),
      user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
