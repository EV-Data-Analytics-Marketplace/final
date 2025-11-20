import { useState, useEffect } from 'react';
import {
  grantAccess,
  getMyAccesses,
  getAccessById,
  recordDownload,
  recordApiCall,
  revokeAccess,
} from '../../api/dataService';

/**
 * Hook to fetch user's accesses
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Accesses state and functions
 */
export const useMyAccesses = (autoFetch = true) => {
  const [accesses, setAccesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccesses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyAccesses();
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
 * Hook to fetch a specific access
 * @param {number} accessId - Access ID
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Access state and functions
 */
export const useAccess = (accessId, autoFetch = true) => {
  const [access, setAccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccess = async () => {
    if (!accessId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getAccessById(accessId);
      setAccess(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch access';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && accessId) {
      fetchAccess();
    }
  }, [accessId, autoFetch]);

  return {
    access,
    isLoading,
    error,
    refetch: fetchAccess,
  };
};

/**
 * Hook for access management operations
 * @returns {Object} Access management functions and state
 */
export const useAccessManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Grant access to a dataset
   * @param {Object} accessData - Access request data
   */
  const grant = async (accessData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await grantAccess(accessData);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to grant access';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Record a download
   * @param {number} datasetId - Dataset ID
   */
  const download = async (datasetId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await recordDownload(datasetId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to record download';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Record an API call
   * @param {number} datasetId - Dataset ID
   * @param {string} apiToken - API token
   */
  const apiCall = async (datasetId, apiToken) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await recordApiCall(datasetId, apiToken);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to record API call';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Revoke access
   * @param {number} accessId - Access ID
   */
  const revoke = async (accessId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await revokeAccess(accessId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to revoke access';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    grant,
    download,
    apiCall,
    revoke,
    isLoading,
    error,
  };
};

export default {
  useMyAccesses,
  useAccess,
  useAccessManagement,
};
