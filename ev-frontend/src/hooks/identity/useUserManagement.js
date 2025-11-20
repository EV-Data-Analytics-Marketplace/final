import { useState } from 'react';
import {
  updateUserStatus,
  updateUserRole,
  suspendUser,
  activateUser,
  deleteUser,
  getTokenStats,
  cleanupExpiredTokens,
} from '../../api/identityService';

/**
 * Hook for user management operations (Admin only)
 * @returns {Object} User management functions and state
 */
export const useUserManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Update user status
   * @param {number} userId - User ID
   * @param {string} status - New status
   */
  const updateStatus = async (userId, status) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateUserStatus(userId, status);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update user status';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Update user role
   * @param {number} userId - User ID
   * @param {string} role - New role
   */
  const updateRole = async (userId, role) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateUserRole(userId, role);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update user role';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Suspend a user
   * @param {number} userId - User ID
   * @param {string} reason - Suspension reason
   */
  const suspend = async (userId, reason) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await suspendUser(userId, reason);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to suspend user';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Activate a user
   * @param {number} userId - User ID
   */
  const activate = async (userId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await activateUser(userId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to activate user';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Delete a user
   * @param {number} userId - User ID
   */
  const deleteUserById = async (userId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteUser(userId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete user';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    updateStatus,
    updateRole,
    suspend,
    activate,
    deleteUser: deleteUserById,
    isLoading,
    error,
  };
};

/**
 * Hook for token management operations (Admin only)
 * @returns {Object} Token management functions and state
 */
export const useTokenManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  /**
   * Get token statistics
   */
  const fetchTokenStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getTokenStats();
      setStats(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch token stats';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Cleanup expired tokens
   */
  const cleanup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cleanupExpiredTokens();
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cleanup tokens';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    fetchTokenStats,
    cleanup,
    stats,
    isLoading,
    error,
  };
};

export default {
  useUserManagement,
  useTokenManagement,
};
