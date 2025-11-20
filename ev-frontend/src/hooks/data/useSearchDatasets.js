import { useState } from 'react';
import { searchDatasets as searchDatasetsApi } from '../../api/dataService';

/**
 * Hook to search datasets
 * @returns {Object} Search state and function
 */
export const useSearchDatasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const search = async (criteria) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchDatasetsApi(criteria);
      
      // Handle both paginated and non-paginated responses
      if (response.data.content) {
        // Paginated response
        setDatasets(response.data.content);
        setPagination({
          page: response.data.number || response.data.page || 0,
          size: response.data.size || 10,
          totalElements: response.data.totalElements || 0,
          totalPages: response.data.totalPages || 0,
        });
      } else if (Array.isArray(response.data)) {
        // Non-paginated array response
        setDatasets(response.data);
        setPagination(null);
      } else {
        // Unexpected format
        setDatasets([]);
        setPagination(null);
      }
      
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to search datasets';
      setError({ message: errorMessage, details: err.response?.data });
      setDatasets([]);
      setPagination(null);
      setIsLoading(false);
      throw err;
    }
  };

  return {
    datasets,
    pagination,
    search,
    isLoading,
    error,
  };
};

export default useSearchDatasets;
