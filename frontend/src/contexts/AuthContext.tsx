// File: frontend/src/contexts/AuthContext.tsx
// ACTION: Replace the entire file with this code.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '../api/axiosInstance'; // <-- 1. IMPORT the custom instance
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, username: string, mobile: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs on app start to keep the user logged in
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // No need to set axios headers here, the interceptor handles it!
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // <-- 2. USE the custom instance for the API call
      const response = await axiosInstance.post(`/auth/login`, { username, password });

      if (response.data.success) {
        const { user: userData, token: authToken } = response.data;
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        // <-- 3. REMOVED the manual header setting (axios.defaults...)
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Login failed.' };
    }
  };

  const register = async (name: string, username: string, mobile: string, password: string) => {
    try {
      // Also use the instance here for consistency
      const response = await axiosInstance.post(`/auth/register`, { name, username, mobile, password });
      return { success: response.data.success, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    // <-- 4. REMOVED the manual header deletion (delete axios.defaults...)
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user && !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};