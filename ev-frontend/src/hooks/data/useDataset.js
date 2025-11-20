import { useState, useEffect } from 'react';
import { getDatasetById, viewDatasetPublic } from '../../api/dataService';

/**
 * Hook to get dataset details
 * @param {number} datasetId - Dataset ID
 * @param {boolean} isPublic - Use public endpoint (default: false)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Dataset state and functions
 */
export const useDataset = (datasetId, isPublic = false, autoFetch = true) => {
  const [dataset, setDataset] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDataset = async () => {
    if (!datasetId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = isPublic 
        ? await viewDatasetPublic(datasetId)
        : await getDatasetById(datasetId);
      setDataset(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch dataset';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && datasetId) {
      fetchDataset();
    }
  }, [datasetId, isPublic, autoFetch]);

  return {
    dataset,
    isLoading,
    error,
    refetch: fetchDataset,
  };
};

export default useDataset;
