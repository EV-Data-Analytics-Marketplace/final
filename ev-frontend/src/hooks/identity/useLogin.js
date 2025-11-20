import { useState } from 'react';
import { login as loginApi } from '../../api/identityService';

/**
 * Hook for user login
 * @returns {Object} Login state and function
 * @property {Function} login - Login function
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error object if any
 * @property {Object|null} data - Login response data
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginApi(credentials);
      const { accessToken, refreshToken } = response.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setData(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return { login, isLoading, error, data };
};

export default useLogin;
