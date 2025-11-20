import { useState, useEffect } from 'react';
import {
  getMyPaymentMethods,
  addPaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod,
} from '../../api/paymentService';

/**
 * Hook to fetch user's payment methods
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Payment methods state and functions
 */
export const usePaymentMethods = (autoFetch = true) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyPaymentMethods();
      setPaymentMethods(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch payment methods';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchPaymentMethods();
    }
  }, [autoFetch]);

  return {
    paymentMethods,
    isLoading,
    error,
    refetch: fetchPaymentMethods,
  };
};

/**
 * Hook for payment method management operations
 * @returns {Object} Payment method management functions and state
 */
export const usePaymentMethodManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Add a new payment method
   * @param {Object} paymentMethodData - Payment method data
   */
  const add = async (paymentMethodData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await addPaymentMethod(paymentMethodData);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add payment method';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Set payment method as default
   * @param {number} paymentMethodId - Payment method ID
   */
  const setDefault = async (paymentMethodId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await setDefaultPaymentMethod(paymentMethodId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to set default payment method';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Delete a payment method
   * @param {number} paymentMethodId - Payment method ID
   */
  const remove = async (paymentMethodId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deletePaymentMethod(paymentMethodId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete payment method';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    add,
    setDefault,
    delete: remove,
    isLoading,
    error,
  };
};

export default {
  usePaymentMethods,
  usePaymentMethodManagement,
};
