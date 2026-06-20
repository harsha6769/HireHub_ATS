import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Attempt to restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse cached user details', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: jwt, id, firstName, lastName, role } = res.data;
      
      const loggedUser = { id, email, firstName, lastName, role };
      
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      
      setToken(jwt);
      setUser(loggedUser);
      setIsAuthenticated(true);
      setIsLoading(false);
      return loggedUser;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (userData) => {
    // API endpoint for user registration is /auth/register
    return await api.post('/auth/register', userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
