import { useState, useEffect } from 'react';
import {
  getAdminStats,
  getAllDatasetsAdmin,
  updateDatasetStatus,
  getAllAccessesAdmin,
  getProvidersStats,
} from '../../api/dataService';

/**
 * Hook to fetch admin statistics
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Statistics state and functions
 */
export const useDataAdminStats = (autoFetch = true) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminStats();
      setStats(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch statistics';
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

/**
 * Hook to fetch all datasets (admin view)
 * @param {string} status - Filter by status (optional)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Datasets state and functions
 */
export const useAllDatasets = (status = null, autoFetch = true) => {
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDatasets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllDatasetsAdmin(status);
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
  }, [status, autoFetch]);

  return {
    datasets,
    isLoading,
    error,
    refetch: fetchDatasets,
  };
};

/**
 * Hook to fetch all accesses (admin view)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Accesses state and functions
 */
export const useAllAccesses = (autoFetch = true) => {
  const [accesses, setAccesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccesses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllAccessesAdmin();
      setAccesses(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch accesses';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchAccesses();
    }
  }, [autoFetch]);

  return {
    accesses,
    isLoading,
    error,
    refetch: fetchAccesses,
  };
};

/**
 * Hook to fetch provider statistics
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Provider stats state and functions
 */
export const useProvidersStats = (autoFetch = true) => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProvidersStats();
      setStats(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch provider stats';
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

/**
 * Hook for admin dataset management
 * @returns {Object} Admin management functions and state
 */
export const useDatasetAdminManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Update dataset status
   * @param {number} datasetId - Dataset ID
   * @param {string} status - New status (PUBLISHED, ARCHIVED, SUSPENDED)
   */
  const updateStatus = async (datasetId, status) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateDatasetStatus(datasetId, status);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update dataset status';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    updateStatus,
    isLoading,
    error,
  };
};

export default {
  useDataAdminStats,
  useAllDatasets,
  useAllAccesses,
  useProvidersStats,
  useDatasetAdminManagement,
};
