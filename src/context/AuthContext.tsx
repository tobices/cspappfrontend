import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { authAPI, userAPI } from '../services/api';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'role'>) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          let user = JSON.parse(storedUser);
          user = {
            ...user,
            id: user._id || user.id,
            _id: user._id || user.id
          };
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      let { user, token, refreshToken } = response.data.data;

      user = {
        ...user,
        id: user._id || user.id,
        _id: user._id || user.id
      };

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success(`Welcome back, ${user.fullName}!`);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.info('You have been logged out');
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'role'>): Promise<boolean> => {
    try {
      await authAPI.register(userData);
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
    try {
      console.log('AuthContext - Updating user with ID:', userId);

      const response = await userAPI.updateProfile(userId, userData);
      let updatedUser = response.data.data.user;

      updatedUser = {
        ...updatedUser,
        id: updatedUser._id || updatedUser.id,
        _id: updatedUser._id || updatedUser.id
      };

      const currentUserId = authState.user?.id || authState.user?._id;
      if (currentUserId === userId) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setAuthState(prev => ({ ...prev, user: updatedUser }));
      }

      // NO TOAST HERE - the component will show its own toast
    } catch (error: any) {
      console.error('Update user error:', error);
      toast.error(error.response?.data?.message || 'Update failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};