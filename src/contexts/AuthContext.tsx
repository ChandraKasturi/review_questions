'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, LoginRequest } from '@/types';
import { authAPI } from '@/lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('x-auth-session');
    if (token) {
      setSessionToken(token);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const { response, token } = await authAPI.login(credentials);
      
      localStorage.setItem('x-auth-session', token);
      setSessionToken(token);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('x-auth-session');
    setSessionToken(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    sessionToken,
    login,
    logout,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};