import { useState, useEffect } from 'react';
import { getMyReports, getReportById, deleteReport } from '../../api/analyticsService';

/**
 * Hook to fetch user's reports
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Reports state and functions
 */
export const useReports = (autoFetch = true) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyReports();
      setReports(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch reports';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchReports();
    }
  }, [autoFetch]);

  return {
    reports,
    isLoading,
    error,
    refetch: fetchReports,
  };
};

/**
 * Hook to fetch a single report by ID
 * @param {number} reportId - Report ID
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Report state and functions
 */
export const useReport = (reportId, autoFetch = true) => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    if (!reportId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getReportById(reportId);
      setReport(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch report';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && reportId) {
      fetchReport();
    }
  }, [reportId, autoFetch]);

  return {
    report,
    isLoading,
    error,
    refetch: fetchReport,
  };
};

/**
 * Hook for report management operations
 * @returns {Object} Report management functions and state
 */
export const useReportManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Delete a report
   * @param {number} reportId - Report ID
   */
  const deleteReportById = async (reportId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteReport(reportId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete report';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    deleteReportById,
    isLoading,
    error,
  };
};

export default {
  useReports,
  useReport,
  useReportManagement,
};
