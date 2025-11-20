import { useState, useEffect } from 'react';
import { assessDataQuality, getLatestQuality, getLowQualityDatasets } from '../../api/analyticsService';

/**
 * Hook to fetch latest quality assessment for a dataset
 * @param {number} datasetId - Dataset ID
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Quality state and functions
 */
export const useDatasetQuality = (datasetId, autoFetch = true) => {
  const [quality, setQuality] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuality = async () => {
    if (!datasetId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getLatestQuality(datasetId);
      setQuality(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch quality assessment';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && datasetId) {
      fetchQuality();
    }
  }, [datasetId, autoFetch]);

  return {
    quality,
    isLoading,
    error,
    refetch: fetchQuality,
  };
};

/**
 * Hook to fetch datasets with low quality scores
 * @param {number} threshold - Quality score threshold (default: 80.0)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Low quality datasets state and functions
 */
export const useLowQualityDatasets = (threshold = 80.0, autoFetch = true) => {
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDatasets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getLowQualityDatasets(threshold);
      setDatasets(Array.isArray(response.data) ? response.data : []);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      // Silently handle error - will be displayed in UI
      const errorMessage = err.response?.data?.message || 'Failed to fetch low quality datasets';
      setError({ message: errorMessage, details: err.response?.data });
      setDatasets([]);
      setIsLoading(false);
      // Don't throw - just set error state
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchDatasets().catch(err => {
        // Silently catch to prevent unhandled promise rejection
        // Error is already logged in fetchDatasets function
      });
    }
  }, [threshold, autoFetch]);

  return {
    datasets,
    isLoading,
    error,
    refetch: fetchDatasets,
  };
};

/**
 * Hook to assess data quality
 * @returns {Object} Assess quality function and state
 */
export const useAssessQuality = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);

  /**
   * Assess data quality for a dataset
   * @param {number} datasetId - Dataset ID
   * @param {Object} datasetMetrics - Quality metrics
   * @param {number} datasetMetrics.completeness - Completeness score (0-1)
   * @param {number} datasetMetrics.row_count - Number of rows
   * @param {number} datasetMetrics.duplicates - Number of duplicates
   * @param {string} datasetMetrics.lastUpdated - Last updated timestamp
   */
  const assess = async (datasetId, datasetMetrics) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await assessDataQuality(datasetId, datasetMetrics);
      setAssessment(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to assess data quality';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    assess,
    assessment,
    isLoading,
    error,
  };
};

/**
 * Hook to assess data quality (wrapper for form submission)
 * @returns {Object} Assess function and state
 */
export const useAssessDataQuality = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);

  /**
   * Assess data quality with full metrics
   * @param {Object} data - Assessment data
   * @param {number} data.datasetId - Dataset ID
   * @param {number} data.completenessScore - Completeness (0-100)
   * @param {number} data.accuracyScore - Accuracy (0-100)
   * @param {number} data.consistencyScore - Consistency (0-100)
   * @param {number} data.timelinessScore - Timeliness (0-100)
   * @param {number} data.validityScore - Validity (0-100)
   * @param {Array<string>} data.issuesFound - List of issues
   * @param {Array<string>} data.recommendations - List of recommendations
   */
  const assess = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const { datasetId, ...metrics } = data;
      const response = await assessDataQuality(datasetId, metrics);
      setAssessment(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to assess data quality';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    assess,
    assessment,
    isLoading,
    error,
  };
};

export default {
  useDatasetQuality,
  useLowQualityDatasets,
  useAssessQuality,
  useAssessDataQuality,
};
