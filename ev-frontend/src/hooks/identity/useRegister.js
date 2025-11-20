import { useState } from 'react';
import { register as registerApi } from '../../api/identityService';

/**
 * Hook for user registration
 * @returns {Object} Registration state and function
 * @property {Function} register - Registration function
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error object if any
 * @property {Object|null} data - Registration response data
 */
export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerApi(userData);
      setData(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return { register, isLoading, error, data };
};

export default useRegister;
