import { useState, useEffect } from 'react';
import {
  getMyRefunds,
  createRefundRequest,
  approveRefund,
  rejectRefund,
} from '../../api/paymentService';

/**
 * Hook to fetch user's refund requests
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Refunds state and functions
 */
export const useRefunds = (autoFetch = true) => {
  const [refunds, setRefunds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRefunds = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyRefunds();
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
  }, [autoFetch]);

  return {
    refunds,
    isLoading,
    error,
    refetch: fetchRefunds,
  };
};

/**
 * Hook for refund management operations
 * @returns {Object} Refund management functions and state
 */
export const useRefundManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a refund request
   * @param {Object} refundData - Refund request data
   */
  const create = async (refundData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createRefundRequest(refundData);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create refund request';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Approve a refund (ADMIN only)
   * @param {number} refundId - Refund ID
   */
  const approve = async (refundId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await approveRefund(refundId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to approve refund';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Reject a refund (ADMIN only)
   * @param {number} refundId - Refund ID
   * @param {string} reason - Rejection reason
   */
  const reject = async (refundId, reason) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await rejectRefund(refundId, reason);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reject refund';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    create,
    approve,
    reject,
    isLoading,
    error,
  };
};

export default {
  useRefunds,
  useRefundManagement,
};
