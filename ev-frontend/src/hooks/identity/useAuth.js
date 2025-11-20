import { useState, useEffect } from 'react';
import { useLogin } from './useLogin';
import { useLogout } from './useLogout';

/**
 * Hook for authentication state management
 * @returns {Object} Auth state and functions
 * @property {Object|null} user - Current user data
 * @property {boolean} isAuthenticated - Authentication status
 * @property {Function} login - Login function
 * @property {Function} logout - Logout function
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error object if any
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { login: loginFn, isLoading: loginLoading, error: loginError } = useLogin();
  const { logout: logoutFn, isLoading: logoutLoading, error: logoutError } = useLogout();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      // Optionally fetch user profile here
    }
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await loginFn(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      setIsAuthenticated(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutFn();
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (err) {
      // Still clear local state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      throw err;
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading: loginLoading || logoutLoading,
    error: loginError || logoutError,
  };
};

export default useAuth;
