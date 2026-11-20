import React, { createContext, useContext, useState } from 'react';
import { signIn as signInWithBackend } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Temporary frontend-only access for demonstrations. This is not authentication.
  const continueInDemoMode = () => {
    setUser({ name: 'Demo User', mode: 'demo' });
  };

  const signIn = async (credentials) => {
    const authenticatedUser = await signInWithBackend(credentials);
    setUser(authenticatedUser);
  };

  const logout = () => setUser(null);
  const value = { user, isAuthenticated: Boolean(user), continueInDemoMode, signIn, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
