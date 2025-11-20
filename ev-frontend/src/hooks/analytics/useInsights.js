import { useState, useEffect } from 'react';
import { getActiveInsights, getInsightsByDataset, deactivateInsight } from '../../api/analyticsService';

/**
 * Hook to fetch active insights
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Insights state and functions
 */
export const useActiveInsights = (autoFetch = true) => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getActiveInsights();
      setInsights(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch insights';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchInsights();
    }
  }, [autoFetch]);

  return {
    insights,
    isLoading,
    error,
    refetch: fetchInsights,
  };
};

/**
 * Hook to fetch insights for a specific dataset
 * @param {number} datasetId - Dataset ID
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Insights state and functions
 */
export const useDatasetInsights = (datasetId, autoFetch = true) => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    if (!datasetId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getInsightsByDataset(datasetId);
      setInsights(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch dataset insights';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && datasetId) {
      fetchInsights();
    }
  }, [datasetId, autoFetch]);

  return {
    insights,
    isLoading,
    error,
    refetch: fetchInsights,
  };
};

/**
 * Hook for insight management operations
 * @returns {Object} Insight management functions and state
 */
export const useInsightManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Deactivate an insight
   * @param {number} insightId - Insight ID
   */
  const deactivate = async (insightId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deactivateInsight(insightId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to deactivate insight';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    deactivate,
    isLoading,
    error,
  };
};

export default {
  useActiveInsights,
  useDatasetInsights,
  useInsightManagement,
};
