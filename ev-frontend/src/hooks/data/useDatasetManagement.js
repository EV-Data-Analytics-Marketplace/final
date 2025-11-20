import { useState } from 'react';
import { createDataset, updateDataset, publishDataset, deleteDataset } from '../../api/dataService';

/**
 * Hook for dataset management operations
 * @returns {Object} Dataset management functions and state
 */
export const useDatasetManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new dataset
   * @param {Object} datasetData - Dataset data
   */
  const create = async (datasetData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createDataset(datasetData);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create dataset';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Update a dataset
   * @param {number} datasetId - Dataset ID
   * @param {Object} datasetData - Updated dataset data
   */
  const update = async (datasetId, datasetData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateDataset(datasetId, datasetData);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update dataset';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Publish a dataset
   * @param {number} datasetId - Dataset ID
   */
  const publish = async (datasetId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await publishDataset(datasetId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to publish dataset';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Delete a dataset
   * @param {number} datasetId - Dataset ID
   */
  const remove = async (datasetId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteDataset(datasetId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete dataset';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    create,
    update,
    publish,
    delete: remove,
    isLoading,
    error,
  };
};

export default useDatasetManagement;
