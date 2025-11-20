import { useState, useEffect } from 'react';
import {
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  getCategoryByCode,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../api/dataService';

/**
 * Hook to fetch all categories
 * @param {boolean} activeOnly - Fetch only active categories (default: false)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Categories state and functions
 */
export const useCategories = (activeOnly = false, autoFetch = true) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = activeOnly ? await getActiveCategories() : await getAllCategories();
      setCategories(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch categories';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [activeOnly, autoFetch]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
};

/**
 * Hook to fetch a single category
 * @param {number|string} identifier - Category ID or code
 * @param {boolean} byCode - Whether identifier is a code (default: false)
 * @param {boolean} autoFetch - Auto fetch on mount (default: true)
 * @returns {Object} Category state and functions
 */
export const useCategory = (identifier, byCode = false, autoFetch = true) => {
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategory = async () => {
    if (!identifier) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = byCode 
        ? await getCategoryByCode(identifier)
        : await getCategoryById(identifier);
      setCategory(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch category';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && identifier) {
      fetchCategory();
    }
  }, [identifier, byCode, autoFetch]);

  return {
    category,
    isLoading,
    error,
    refetch: fetchCategory,
  };
};

/**
 * Hook for category management operations (ADMIN only)
 * @returns {Object} Category management functions and state
 */
export const useCategoryManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   */
  const create = async (categoryData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createCategory(categoryData);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create category';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Update a category
   * @param {number} categoryId - Category ID
   * @param {Object} categoryData - Updated category data
   */
  const update = async (categoryId, categoryData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateCategory(categoryId, categoryData);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update category';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Delete a category
   * @param {number} categoryId - Category ID
   */
  const remove = async (categoryId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await deleteCategory(categoryId);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete category';
      setError({ message: errorMessage, details: err.response?.data });
      setIsLoading(false);
      throw err;
    }
  };

  return {
    create,
    update,
    delete: remove,
    isLoading,
    error,
  };
};

export default {
  useCategories,
  useCategory,
  useCategoryManagement,
};
