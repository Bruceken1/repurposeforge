import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    if (pb.authStore.isValid && pb.authStore.model) {
      setCurrentUser(pb.authStore.model);
    }
    setLoading(false);

    // Listen for auth changes
    pb.authStore.onChange(() => {
      setCurrentUser(pb.authStore.model);
    });
  }, []);

  const signup = async (email, password, name) => {
    try {
      // Create user
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name,
        subscription_tier: 'free',
        daily_usage_count: 0
      });

      // Login after signup
      const authData = await pb.collection('users').authWithPassword(email, password);
      setCurrentUser(authData.record);
      return authData.record;
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  };

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      setCurrentUser(authData.record);
      return authData.record;
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const loginWithGoogle = () => {
    pb.collection('users').authWithOAuth2({ provider: 'google' })
      .then((authData) => {
        setCurrentUser(authData.record);
      })
      .catch((err) => {
        throw new Error('Google login failed: ' + err.message);
      });
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated: pb.authStore.isValid
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};