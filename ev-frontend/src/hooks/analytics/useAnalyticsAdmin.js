import { useState, useEffect } from 'react';
import { getAnalyticsStats } from '../../api/analyticsService';

/**
 * Hook to fetch analytics statistics (ADMIN only)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Analytics stats state and functions
 */
export const useAnalyticsStats = (autoFetch = true) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAnalyticsStats();
      setStats(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch analytics stats';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};

export default useAnalyticsStats;
