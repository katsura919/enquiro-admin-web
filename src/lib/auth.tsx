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
  register: (userData: RegisterData) => Promise<{ email: string; expiresIn: string }>;
  verifyCode: (email: string, code: string) => Promise<{ verified: boolean }>;
  completeRegistration: (email: string) => Promise<{ token: string; user: User; business: any }>;
  resendCode: (email: string) => Promise<{ email: string; expiresIn: string }>;
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
      
      // Return the response data instead of redirecting
      return {
        email: data.email,
        expiresIn: data.expiresIn
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const verifyCode = async (email: string, code: string) => {
    try {
      const response = await api.post('/auth/verify-code', { email, code });
      const data = response.data;
      
      return {
        verified: data.verified
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Verification failed');
    }
  };

  const completeRegistration = async (email: string) => {
    try {
      const response = await api.post('/auth/complete-registration', { email });
      const data = response.data;
      
      // Store the token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      return {
        token: data.token,
        user: data.user,
        business: data.business
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration completion failed');
    }
  };

  const resendCode = async (email: string) => {
    try {
      const response = await api.post('/auth/resend-code', { email });
      const data = response.data;
      
      return {
        email: data.email,
        expiresIn: data.expiresIn
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to resend code');
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
    <AuthContext.Provider value={{ user, login, register, verifyCode, completeRegistration, resendCode, logout, isLoading }}>
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