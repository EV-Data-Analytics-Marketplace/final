import { useState, useEffect } from 'react';
import { createPrediction, getMyPredictions, getPredictionById } from '../../api/analyticsService';

/**
 * Hook to fetch user's predictions
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Predictions state and functions
 */
export const usePredictions = (autoFetch = true) => {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPredictions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyPredictions();
      setPredictions(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch predictions';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchPredictions();
    }
  }, [autoFetch]);

  return {
    predictions,
    isLoading,
    error,
    refetch: fetchPredictions,
  };
};

/**
 * Hook to fetch a single prediction by ID
 * @param {number} predictionId - Prediction ID
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Prediction state and functions
 */
export const usePrediction = (predictionId, autoFetch = true) => {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrediction = async () => {
    if (!predictionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getPredictionById(predictionId);
      setPrediction(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch prediction';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && predictionId) {
      fetchPrediction();
    }
  }, [predictionId, autoFetch]);

  return {
    prediction,
    isLoading,
    error,
    refetch: fetchPrediction,
  };
};

/**
 * Hook to create a new prediction
 * @returns {Object} Create prediction function and state
 */
export const useCreatePrediction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdPrediction, setCreatedPrediction] = useState(null);

  /**
   * Create a new prediction
   * @param {Object} predictionData - Prediction request data
   * @param {string} predictionData.predictionType - Type of prediction (BATTERY_DEGRADATION, RANGE_ESTIMATION, etc.)
   * @param {number} predictionData.datasetId - Dataset ID
   * @param {Object} predictionData.inputData - Input data for prediction
   * @param {string} predictionData.modelVersion - Model version to use
   */
  const create = async (predictionData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createPrediction(predictionData);
      setCreatedPrediction(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create prediction';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    create,
    createdPrediction,
    isLoading,
    error,
  };
};

export default {
  usePredictions,
  usePrediction,
  useCreatePrediction,
};
