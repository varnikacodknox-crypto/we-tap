import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({
    name: 'Tester Admin',
    email: 'tester@gmail.com',
    orgName: 'WeTap Enterprise',
  });

  const login = (email, password) => {
    setUser({
      name: email.split('@')[0] || 'Admin User',
      email: email,
      orgName: 'WeTap Enterprise',
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
