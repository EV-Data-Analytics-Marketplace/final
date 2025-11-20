import { useState, useEffect } from 'react';
import {
  getMyRevenue,
  getRevenueByMonth,
  getTotalEarnings,
} from '../../api/paymentService';

/**
 * Hook to fetch provider's revenue
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Revenue state and functions
 */
export const useRevenue = (autoFetch = true) => {
  const [revenues, setRevenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRevenue = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyRevenue();
      setRevenues(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch revenue';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchRevenue();
    }
  }, [autoFetch]);

  return {
    revenues,
    isLoading,
    error,
    refetch: fetchRevenue,
  };
};

/**
 * Hook to fetch monthly revenue
 * @returns {Object} Monthly revenue state and functions
 */
export const useMonthlyRevenue = () => {
  const [revenue, setRevenue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMonthlyRevenue = async (year, month) => {
    if (!year || !month) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getRevenueByMonth(year, month);
      setRevenue(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.status === 404 
        ? 'No revenue data found for this period'
        : err.response?.data?.message || 'Failed to fetch monthly revenue';
      setError({ message: errorMessage, details: err.response?.data });
      setRevenue(null);
      setIsLoading(false);
      // Don't throw for 404, just set error state
      if (err.response?.status !== 404) {
        throw err;
      }
    }
  };

  return {
    revenue,
    isLoading,
    error,
    fetchMonthlyRevenue,
  };
};

/**
 * Hook to fetch total earnings
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Total earnings state and functions
 */
export const useTotalEarnings = (autoFetch = true) => {
  const [earnings, setEarnings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEarnings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getTotalEarnings();
      setEarnings(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch total earnings';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchEarnings();
    }
  }, [autoFetch]);

  return {
    earnings,
    isLoading,
    error,
    refetch: fetchEarnings,
  };
};

export default {
  useRevenue,
  useMonthlyRevenue,
  useTotalEarnings,
};
