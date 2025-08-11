import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTerminal } from '../context/useTerminal';

interface User {
  id?: number;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'USER';
  clientId?: number;
  mustResetPassword?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: () => boolean;
  isLoggedIn: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const terminal = useTerminal();

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    terminal.info(`Authenticating user: ${username}`);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      if (data.token) {
        const userData: User = {
          username: data.username,
          fullName: data.fullName,
          role: data.role,
          clientId: data.clientId,
          mustResetPassword: data.mustResetPassword,
        };

        setToken(data.token);
        setUser(userData);

        // Store in localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(userData));

        if (data.mustResetPassword) {
          terminal.error('You must reset your password before continuing');
          // TODO: Implement password reset flow
        } else {
          terminal.success(`Welcome back, ${data.fullName}!`);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      terminal.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    terminal.info('You have been logged out');
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isLoggedIn = () => {
    return user !== null && token !== null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAdmin,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};