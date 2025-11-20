import { useState, useEffect } from 'react';
import { getMyDatasets } from '../../api/dataService';

/**
 * Hook to get user's own datasets
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Datasets state and functions
 */
export const useMyDatasets = (autoFetch = true) => {
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDatasets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyDatasets();
      setDatasets(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch datasets';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchDatasets();
    }
  }, [autoFetch]);

  return {
    datasets,
    isLoading,
    error,
    refetch: fetchDatasets,
  };
};

export default useMyDatasets;
