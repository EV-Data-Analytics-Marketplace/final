import { useState } from 'react';
import { createReport } from '../../api/analyticsService';

/**
 * Hook to create a new analysis report
 * @returns {Object} Create report function and state
 */
export const useCreateReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdReport, setCreatedReport] = useState(null);

  /**
   * Create a new report
   * @param {Object} reportData - Report creation data
   * @param {string} reportData.reportType - Type of report (BATTERY_HEALTH, ENERGY_CONSUMPTION, etc.)
   * @param {number} reportData.datasetId - Dataset ID
   * @param {string} reportData.title - Report title
   * @param {string} reportData.description - Report description
   * @param {Object} reportData.parameters - Report parameters
   */
  const create = async (reportData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createReport(reportData);
      setCreatedReport(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create report';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    create,
    createdReport,
    isLoading,
    error,
  };
};

export default useCreateReport;
