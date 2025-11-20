import { useState, useEffect } from 'react';
import { rateDataset, getDatasetRatings, getMyRatings, deleteRating } from '../../api/dataService';

/**
 * Hook to fetch ratings for a dataset
 * @param {number} datasetId - Dataset ID
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Ratings state and functions
 */
export const useDatasetRatings = (datasetId, autoFetch = true) => {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRatings = async () => {
    if (!datasetId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getDatasetRatings(datasetId);
      setRatings(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch ratings';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && datasetId) {
      fetchRatings();
    }
  }, [datasetId, autoFetch]);

  return {
    ratings,
    isLoading,
    error,
    refetch: fetchRatings,
  };
};

/**
 * Hook to fetch user's own ratings
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Ratings state and functions
 */
export const useMyRatings = (autoFetch = true) => {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRatings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyRatings();
      setRatings(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch ratings';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchRatings();
    }
  }, [autoFetch]);

  return {
    ratings,
    isLoading,
    error,
    refetch: fetchRatings,
  };
};

/**
 * Hook for rating operations
 * @returns {Object} Rating functions and state
 */
export const useRatingManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a rating
   * @param {Object} ratingData - Rating data
   */
  const create = async (ratingData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await rateDataset(ratingData);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create rating';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Delete a rating
   * @param {number} ratingId - Rating ID
   */
  const remove = async (ratingId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteRating(ratingId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete rating';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    create,
    delete: remove,
    isLoading,
    error,
  };
};

export default {
  useDatasetRatings,
  useMyRatings,
  useRatingManagement,
};
