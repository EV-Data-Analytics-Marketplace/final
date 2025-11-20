import { useState, useEffect } from 'react';
import { getAllUsers, getUserStats, getUsersByRole, getUsersByStatus } from '../../api/identityService';

/**
 * Hook to fetch all users (Admin only)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Users state and functions
 * @property {Array} users - List of all users
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error object if any
 * @property {Function} refetch - Function to refetch users
 */
export const useUsers = (autoFetch = true) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching users from API...');
      const response = await getAllUsers();
      console.log('Users API response:', response.data);
      
      // Handle different response formats
      const usersData = response.data.users || response.data;
      setUsers(Array.isArray(usersData) ? usersData : []);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      console.error('Error fetching users:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || 'Failed to fetch users';
      setError({ message: errorMessage, details: err.response?.data });
      setUsers([]); // Reset to empty array on error
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
  };
};

/**
 * Hook to fetch user statistics (Admin only)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} User stats state and functions
 * @property {Object|null} stats - User statistics
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error object if any
 * @property {Function} refetch - Function to refetch stats
 */
export const useUserStats = (autoFetch = true) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserStats();
      setStats(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch user stats';
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
 * Hook to fetch users by role (Admin only)
 * @param {string} role - User role to filter by
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Users by role state and functions
 * @property {Array} users - List of users with specified role
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error object if any
 * @property {Function} refetch - Function to refetch users
 */
export const useUsersByRole = (role, autoFetch = true) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsersByRole = async () => {
    if (!role) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUsersByRole(role);
      setUsers(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch users by role';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && role) {
      fetchUsersByRole();
    }
  }, [autoFetch, role]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsersByRole,
  };
};

/**
 * Hook to fetch users by status (Admin only)
 * @param {string} status - User status to filter by
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Users by status state and functions
 * @property {Array} users - List of users with specified status
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} error - Error object if any
 * @property {Function} refetch - Function to refetch users
 */
export const useUsersByStatus = (status, autoFetch = true) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsersByStatus = async () => {
    if (!status) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUsersByStatus(status);
      setUsers(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch users by status';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && status) {
      fetchUsersByStatus();
    }
  }, [autoFetch, status]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsersByStatus,
  };
};

export default {
  useUsers,
  useUserStats,
  useUsersByRole,
  useUsersByStatus,
};
