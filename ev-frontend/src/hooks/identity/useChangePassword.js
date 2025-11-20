import { useState } from 'react';
import { changeMyPassword } from '../../api/identityService';

/**
 * Hook to change current user's password
 * @returns {Object} Change password state and function
 * @property {Function} changePassword - Change password function
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error object if any
 * @property {boolean} success - Success state
 */
export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (passwordData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await changeMyPassword(passwordData);
      setSuccess(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    changePassword,
    isLoading,
    error,
    success,
  };
};

export default useChangePassword;
