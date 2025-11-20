import { useState } from 'react';
import { createTransaction } from '../../api/paymentService';

/**
 * Hook to create a new transaction
 * @returns {Object} Create transaction state and function
 */
export const useCreateTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  const create = async (transactionData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createTransaction(transactionData);
      setTransaction(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create transaction';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    create,
    transaction,
    isLoading,
    error,
  };
};

export default useCreateTransaction;
