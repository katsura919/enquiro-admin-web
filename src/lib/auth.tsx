"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  businessId: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  businessName: string;
  description: string;
  logo?: string;
  category: string;
  address: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  console.log(user)

  useEffect(() => {
    // Check for stored token and fetch user info
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await api.get('/user/info');
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));


    } catch (error) {
      console.log('Failed to fetch user info, clearing authentication data');
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      localStorage.setItem('token', data.token);
      await fetchUserInfo(data.token);
      router.push('/dashboard'); 
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/auth/register', userData);

      const data = response.data;
      router.push('/auth/login'); // Redirect to login after successful registration
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = () => {
    // Clear all authentication-related items from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear any other app-specific items that should be removed on logout
    // You can add more items here if needed
    
    setUser(null);
    
    // Use window.location.href for a hard redirect to ensure complete cleanup
    // This prevents any cached state from lingering
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 