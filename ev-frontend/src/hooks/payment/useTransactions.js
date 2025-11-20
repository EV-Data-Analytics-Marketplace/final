import { useState, useEffect } from 'react';
import {
  getMyTransactions,
  getConsumerTransactions,
  getProviderTransactions,
  getTransactionById,
  getTransactionByRef,
} from '../../api/paymentService';

/**
 * Hook to fetch user's transactions
 * @param {string} type - Transaction type filter ('all', 'consumer', 'provider')
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Transactions state and functions
 */
export const useTransactions = (type = 'all', autoFetch = true) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response;
      switch (type) {
        case 'consumer':
          response = await getConsumerTransactions();
          break;
        case 'provider':
          response = await getProviderTransactions();
          break;
        default:
          response = await getMyTransactions();
      }
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
  }, [type, autoFetch]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
};

/**
 * Hook to fetch a single transaction
 * @param {number|string} identifier - Transaction ID or reference
 * @param {boolean} byRef - Whether identifier is a reference (default: false)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Transaction state and functions
 */
export const useTransaction = (identifier, byRef = false, autoFetch = true) => {
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransaction = async () => {
    if (!identifier) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = byRef
        ? await getTransactionByRef(identifier)
        : await getTransactionById(identifier);
      setTransaction(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch transaction';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && identifier) {
      fetchTransaction();
    }
  }, [identifier, byRef, autoFetch]);

  return {
    transaction,
    isLoading,
    error,
    refetch: fetchTransaction,
  };
};

export default {
  useTransactions,
  useTransaction,
};
