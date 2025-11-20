import { useState, useEffect } from 'react';
import {
  createDashboard,
  updateDashboard,
  getMyDashboards,
  getPublicDashboards,
  getDashboardById,
  deleteDashboard,
} from '../../api/analyticsService';

/**
 * Hook to fetch user's dashboards
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Dashboards state and functions
 */
export const useMyDashboards = (autoFetch = true) => {
  const [dashboards, setDashboards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyDashboards();
      setDashboards(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch dashboards';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchDashboards();
    }
  }, [autoFetch]);

  return {
    dashboards,
    isLoading,
    error,
    refetch: fetchDashboards,
  };
};

/**
 * Hook to fetch public dashboards
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Public dashboards state and functions
 */
export const usePublicDashboards = (autoFetch = true) => {
  const [dashboards, setDashboards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPublicDashboards();
      setDashboards(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch public dashboards';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchDashboards();
    }
  }, [autoFetch]);

  return {
    dashboards,
    isLoading,
    error,
    refetch: fetchDashboards,
  };
};

/**
 * Hook to fetch a single dashboard by ID
 * @param {number} dashboardId - Dashboard ID
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Dashboard state and functions
 */
export const useDashboard = (dashboardId, autoFetch = true) => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    if (!dashboardId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getDashboardById(dashboardId);
      setDashboard(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch dashboard';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && dashboardId) {
      fetchDashboard();
    }
  }, [dashboardId, autoFetch]);

  return {
    dashboard,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
};

/**
 * Hook for dashboard management operations
 * @returns {Object} Dashboard management functions and state
 */
export const useDashboardManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new dashboard
   * @param {Object} dashboardData - Dashboard creation data
   */
  const create = async (dashboardData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createDashboard(dashboardData);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create dashboard';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Update an existing dashboard
   * @param {number} dashboardId - Dashboard ID
   * @param {Object} dashboardData - Dashboard update data
   */
  const update = async (dashboardId, dashboardData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateDashboard(dashboardId, dashboardData);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update dashboard';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Delete a dashboard
   * @param {number} dashboardId - Dashboard ID
   */
  const remove = async (dashboardId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteDashboard(dashboardId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete dashboard';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    create,
    update,
    remove,
    isLoading,
    error,
  };
};

export default {
  useMyDashboards,
  usePublicDashboards,
  useDashboard,
  useDashboardManagement,
};
