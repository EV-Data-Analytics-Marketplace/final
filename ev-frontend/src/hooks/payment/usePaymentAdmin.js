import { useState, useEffect } from 'react';
import {
  getPaymentStats,
  getAllTransactions,
  getAllRefunds,
  getAllProviderRevenues,
  calculateMonthlyRevenue,
  payProviderRevenue,
} from '../../api/paymentService';

/**
 * Hook to fetch payment statistics (ADMIN only)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Payment stats state and functions
 */
export const usePaymentStats = (autoFetch = true) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPaymentStats();
      setStats(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch payment stats';
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
 * Hook to fetch all transactions (ADMIN only)
 * @param {string} status - Filter by status (optional)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Transactions state and functions
 */
export const useAllTransactions = (status = null, autoFetch = true) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllTransactions(status);
      setTransactions(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch transactions';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTransactions();
    }
  }, [status, autoFetch]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
};

/**
 * Hook to fetch all refunds (ADMIN only)
 * @param {string} status - Filter by status (optional)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Refunds state and functions
 */
export const useAllRefunds = (status = null, autoFetch = true) => {
  const [refunds, setRefunds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRefunds = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllRefunds(status);
      setRefunds(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch refunds';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchRefunds();
    }
  }, [status, autoFetch]);

  return {
    refunds,
    isLoading,
    error,
    refetch: fetchRefunds,
  };
};

/**
 * Hook to fetch all provider revenues (ADMIN only)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Provider revenues state and functions
 */
export const useAllProviderRevenues = (autoFetch = true) => {
  const [revenues, setRevenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRevenues = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllProviderRevenues();
      setRevenues(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch provider revenues';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchRevenues();
    }
  }, [autoFetch]);

  return {
    revenues,
    isLoading,
    error,
    refetch: fetchRevenues,
  };
};

/**
 * Hook for payment admin operations (ADMIN only)
 * @returns {Object} Payment admin functions and state
 */
export const usePaymentAdminOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calculate monthly revenue
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   */
  const calculateRevenue = async (year, month) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await calculateMonthlyRevenue(year, month);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to calculate revenue';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Pay provider revenue
   * @param {number} revenueId - Revenue ID
   */
  const payRevenue = async (revenueId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await payProviderRevenue(revenueId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to pay revenue';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    calculateRevenue,
    payRevenue,
    isLoading,
    error,
  };
};

export default {
  usePaymentStats,
  useAllTransactions,
  useAllRefunds,
  useAllProviderRevenues,
  usePaymentAdminOperations,
};
