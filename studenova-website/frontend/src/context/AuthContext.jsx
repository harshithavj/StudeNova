import { createContext, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

function readSavedUser() {
  const saved = localStorage.getItem('studenova_user');
  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem('studenova_user');
    localStorage.removeItem('studenova_token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser);
  const [loading, setLoading] = useState(false);

  const persistSession = (payload) => {
    localStorage.setItem('studenova_token', payload.access_token);
    localStorage.setItem('studenova_user', JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', credentials);
      persistSession(data);
      toast.success('Welcome back to STUDENOVA');
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', payload);
      persistSession(data);
      toast.success('Your account is ready');
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.patch('/auth/profile', payload);
      localStorage.setItem('studenova_user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Profile updated');
      return data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('studenova_token');
    localStorage.removeItem('studenova_user');
    localStorage.removeItem('studenova_student_events');
    localStorage.removeItem('studenova_saved_events');
    setUser(null);
  };

  const logout = () => {
    clearSession();
    toast.success('Signed out');
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/auth/account');
      clearSession();
      toast.success('Your account has been deleted. Please register again.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ user, loading, login, signup, updateProfile, logout, deleteAccount, clearSession, isAuthenticated: Boolean(user) }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
