import { useState } from 'react';
import { logout as logoutApi } from '../../api/identityService';

/**
 * Hook for user logout
 * @returns {Object} Logout state and function
 * @property {Function} logout - Logout function
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error object if any
 */
export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logoutApi();
      
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Logout failed';
      setError({ message: errorMessage, details: err.response?.data });
      
      // Clear tokens anyway
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      setIsLoading(false);
      throw err;
    }
  };

  return { logout, isLoading, error };
};

export default useLogout;
