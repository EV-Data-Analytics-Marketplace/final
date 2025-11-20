import { useState, useEffect } from 'react';
import { getMyProfile } from '../../api/identityService';

/**
 * Hook to fetch current user's profile
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Profile state and functions
 * @property {Object|null} profile - User profile data
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error object if any
 * @property {Function} refetch - Function to refetch profile
 */
export const useProfile = (autoFetch = true) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyProfile();
      setProfile(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch profile';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProfile();
    }
  }, [autoFetch]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
};

export default useProfile;
