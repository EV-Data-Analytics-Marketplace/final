import { useState } from 'react';
import { updateMyProfile } from '../../api/identityService';

/**
 * Hook to update current user's profile
 * @returns {Object} Update profile state and function
 * @property {Function} updateProfile - Update profile function
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error object if any
 * @property {Object|null} data - Updated profile data
 */
export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateProfile = async (profileData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateMyProfile(profileData);
      setData(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
    data,
  };
};

export default useUpdateProfile;
