import httpClient from './httpClient';

const DATA_BASE = '/data/api';

// ==================== DATASETS API ====================

/**
 * Search datasets (public endpoint)
 * @param {Object} searchCriteria - Search criteria
 * @param {string} [searchCriteria.keyword] - Search keyword
 * @param {number} [searchCriteria.categoryId] - Category ID
 * @param {string} [searchCriteria.dataType] - Data type (RAW, PROCESSED, etc.)
 * @param {string} [searchCriteria.format] - Format (CSV, JSON, etc.)
 * @param {string} [searchCriteria.pricingModel] - Pricing model (FREE, PAY_PER_DOWNLOAD, etc.)
 * @param {string} [searchCriteria.usageRights] - Usage rights
 * @param {number} [searchCriteria.minPrice] - Minimum price
 * @param {number} [searchCriteria.maxPrice] - Maximum price
 * @param {string} [searchCriteria.sortBy] - Sort field (rating, price, etc.)
 * @param {string} [searchCriteria.sortDirection] - Sort direction (ASC, DESC)
 * @param {number} [searchCriteria.page] - Page number (default: 0)
 * @param {number} [searchCriteria.size] - Page size (default: 10)
 * @returns {Promise} Search results with pagination
 * 
 * @example
 * const criteria = {
 *   keyword: "behavior",
 *   categoryId: 1,
 *   format: "CSV",
 *   pricingModel: "FREE",
 *   sortBy: "rating",
 *   sortDirection: "DESC",
 *   page: 0,
 *   size: 10
 * };
 */
export const searchDatasets = (searchCriteria) => {
  return httpClient.post(`${DATA_BASE}/datasets/search`, searchCriteria);
};

/**
 * View dataset public info (increases view count)
 * @param {number} datasetId - Dataset ID
 * @returns {Promise} Dataset public information
 */
export const viewDatasetPublic = (datasetId) => {
  return httpClient.get(`${DATA_BASE}/datasets/public/${datasetId}/view`);
};

/**
 * Get dataset by ID (requires authentication, increases view count)
 * @param {number} datasetId - Dataset ID
 * @returns {Promise} Dataset details
 */
export const getDatasetById = (datasetId) => {
  return httpClient.get(`${DATA_BASE}/datasets/${datasetId}`);
};

/**
 * Create dataset (requires DATA_PROVIDER role)
 * @param {Object} datasetData - Dataset data
 * @returns {Promise} Created dataset
 * 
 * @example
 * const datasetData = {
 *   name: "Vinfast VF8 Driving Data Q1-2024",
 *   code: "VF8_DRIVING_Q1_2024_HCMC",
 *   description: "Driving behavior data...",
 *   categoryId: 1,
 *   dataType: "RAW",
 *   format: "CSV",
 *   pricingModel: "PAY_PER_DOWNLOAD",
 *   price: 50.00,
 *   currency: "USD",
 *   usageRights: "RESEARCH_ONLY",
 *   region: "Asia",
 *   country: "Vietnam",
 *   city: "Ho Chi Minh City",
 *   dataStartDate: "2024-01-01T00:00:00",
 *   dataEndDate: "2024-03-31T23:59:59",
 *   fileUrl: "s3://my-bucket/datasets/vf8_q1_2024.csv",
 *   fileSize: 104857600,
 *   recordCount: 500000,
 *   tags: "vinfast, vf8, driving data",
 *   anonymized: true,
 *   gdprCompliant: true
 * };
 */
export const createDataset = (datasetData) => {
  return httpClient.post(`${DATA_BASE}/datasets`, datasetData);
};

/**
 * Update dataset (owner or ADMIN only)
 * @param {number} datasetId - Dataset ID
 * @param {Object} datasetData - Updated dataset data
 * @returns {Promise} Updated dataset
 */
export const updateDataset = (datasetId, datasetData) => {
  return httpClient.put(`${DATA_BASE}/datasets/${datasetId}`, datasetData);
};

/**
 * Publish dataset (change status from DRAFT to PUBLISHED)
 * @param {number} datasetId - Dataset ID
 * @returns {Promise} Published dataset
 */
export const publishDataset = (datasetId) => {
  return httpClient.post(`${DATA_BASE}/datasets/${datasetId}/publish`);
};

/**
 * Get my datasets (datasets created by current user)
 * @returns {Promise} List of user's datasets
 */
export const getMyDatasets = () => {
  return httpClient.get(`${DATA_BASE}/datasets/my-datasets`);
};

/**
 * Delete dataset (owner or ADMIN only)
 * @param {number} datasetId - Dataset ID
 * @returns {Promise} Deletion response
 */
export const deleteDataset = (datasetId) => {
  return httpClient.delete(`${DATA_BASE}/datasets/${datasetId}`);
};

// ==================== CATEGORIES API ====================

/**
 * Get all categories
 * @returns {Promise} List of all categories
 */
export const getAllCategories = () => {
  return httpClient.get(`${DATA_BASE}/categories`);
};

/**
 * Get active categories only
 * @returns {Promise} List of active categories
 */
export const getActiveCategories = () => {
  return httpClient.get(`${DATA_BASE}/categories/active`);
};

/**
 * Get category by ID
 * @param {number} categoryId - Category ID
 * @returns {Promise} Category details
 */
export const getCategoryById = (categoryId) => {
  return httpClient.get(`${DATA_BASE}/categories/${categoryId}`);
};

/**
 * Get category by code
 * @param {string} code - Category code
 * @returns {Promise} Category details
 * 
 * @example
 * getCategoryByCode("DRIVING_BEHAVIOR");
 */
export const getCategoryByCode = (code) => {
  return httpClient.get(`${DATA_BASE}/categories/code/${code}`);
};

/**
 * Create category (ADMIN only)
 * @param {Object} categoryData - Category data
 * @returns {Promise} Created category
 * 
 * @example
 * const categoryData = {
 *   name: "Predictive Maintenance",
 *   code: "PREDICTIVE_MAINTENANCE",
 *   description: "Data for predictive maintenance",
 *   iconUrl: "/icons/maintenance.png",
 *   type: "VEHICLE_DIAGNOSTICS",
 *   active: true,
 *   displayOrder: 7
 * };
 */
export const createCategory = (categoryData) => {
  return httpClient.post(`${DATA_BASE}/categories`, categoryData);
};

/**
 * Update category (ADMIN only)
 * @param {number} categoryId - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise} Updated category
 */
export const updateCategory = (categoryId, categoryData) => {
  return httpClient.put(`${DATA_BASE}/categories/${categoryId}`, categoryData);
};

/**
 * Delete category (ADMIN only)
 * @param {number} categoryId - Category ID
 * @returns {Promise} Deletion response
 */
export const deleteCategory = (categoryId) => {
  return httpClient.delete(`${DATA_BASE}/categories/${categoryId}`);
};

// ==================== RATINGS API ====================

/**
 * Rate a dataset (requires DATA_CONSUMER role)
 * @param {Object} ratingData - Rating data
 * @param {number} ratingData.datasetId - Dataset ID
 * @param {number} ratingData.rating - Rating value (1-5)
 * @param {string} [ratingData.comment] - Optional comment
 * @returns {Promise} Created rating
 * 
 * @example
 * const ratingData = {
 *   datasetId: 1,
 *   rating: 5,
 *   comment: "Very detailed and useful data!"
 * };
 */
export const rateDataset = (ratingData) => {
  return httpClient.post(`${DATA_BASE}/ratings`, ratingData);
};

/**
 * Get ratings for a dataset
 * @param {number} datasetId - Dataset ID
 * @returns {Promise} List of ratings
 */
export const getDatasetRatings = (datasetId) => {
  return httpClient.get(`${DATA_BASE}/ratings/dataset/${datasetId}`);
};

/**
 * Get my ratings
 * @returns {Promise} List of user's ratings
 */
export const getMyRatings = () => {
  return httpClient.get(`${DATA_BASE}/ratings/my-ratings`);
};

/**
 * Delete rating (owner or ADMIN only)
 * @param {number} ratingId - Rating ID
 * @returns {Promise} Deletion response
 */
export const deleteRating = (ratingId) => {
  return httpClient.delete(`${DATA_BASE}/ratings/${ratingId}`);
};

// ==================== ACCESS API ====================

/**
 * Grant access to dataset (purchase/subscribe)
 * @param {Object} accessData - Access request data
 * @param {number} accessData.datasetId - Dataset ID
 * @param {string} accessData.accessType - Access type (DOWNLOAD, API)
 * @param {number} [accessData.durationDays] - Duration in days (for API access)
 * @param {number} [accessData.apiCallsLimit] - API calls limit
 * @returns {Promise} Created access
 * 
 * @example
 * // For download access
 * const accessData = {
 *   datasetId: 1,
 *   accessType: "DOWNLOAD",
 *   durationDays: null,
 *   apiCallsLimit: 0
 * };
 * 
 * // For API access
 * const accessData = {
 *   datasetId: 2,
 *   accessType: "API",
 *   durationDays: 30,
 *   apiCallsLimit: 10000
 * };
 */
export const grantAccess = (accessData) => {
  return httpClient.post(`${DATA_BASE}/access/grant`, accessData);
};

/**
 * Get my accesses
 * @returns {Promise} List of user's dataset accesses
 */
export const getMyAccesses = () => {
  return httpClient.get(`${DATA_BASE}/access/my-accesses`);
};

/**
 * Get access by ID (owner or ADMIN only)
 * @param {number} accessId - Access ID
 * @returns {Promise} Access details
 */
export const getAccessById = (accessId) => {
  return httpClient.get(`${DATA_BASE}/access/${accessId}`);
};

/**
 * Record download (requires active access)
 * @param {number} datasetId - Dataset ID
 * @returns {Promise} Download record response
 */
export const recordDownload = (datasetId) => {
  return httpClient.post(`${DATA_BASE}/access/download/${datasetId}`);
};

/**
 * Record API call (requires active access and API token)
 * @param {number} datasetId - Dataset ID
 * @param {string} apiToken - API token
 * @returns {Promise} API call record response
 */
export const recordApiCall = (datasetId, apiToken) => {
  return httpClient.post(`${DATA_BASE}/access/api-call/${datasetId}?apiToken=${encodeURIComponent(apiToken)}`);
};

/**
 * Revoke access (owner, provider, or ADMIN only)
 * @param {number} accessId - Access ID
 * @returns {Promise} Revocation response
 */
export const revokeAccess = (accessId) => {
  return httpClient.delete(`${DATA_BASE}/access/${accessId}/revoke`);
};

// ==================== ADMIN API ====================

/**
 * Get system statistics (ADMIN only)
 * @returns {Promise} System statistics
 */
export const getAdminStats = () => {
  return httpClient.get(`${DATA_BASE}/admin/stats`);
};

/**
 * Get all datasets with optional status filter (ADMIN only)
 * @param {string} [status] - Filter by status (DRAFT, PUBLISHED, ARCHIVED)
 * @returns {Promise} List of all datasets
 */
export const getAllDatasetsAdmin = (status = null) => {
  const url = status 
    ? `${DATA_BASE}/admin/datasets?status=${status}`
    : `${DATA_BASE}/admin/datasets`;
  return httpClient.get(url);
};

/**
 * Update dataset status (ADMIN only)
 * @param {number} datasetId - Dataset ID
 * @param {string} status - New status (PUBLISHED, ARCHIVED, SUSPENDED)
 * @returns {Promise} Updated dataset
 */
export const updateDatasetStatus = (datasetId, status) => {
  return httpClient.patch(`${DATA_BASE}/admin/datasets/${datasetId}/status?status=${status}`);
};

/**
 * Get all accesses (ADMIN only)
 * @returns {Promise} List of all dataset accesses
 */
export const getAllAccessesAdmin = () => {
  return httpClient.get(`${DATA_BASE}/admin/accesses`);
};

/**
 * Get providers statistics (ADMIN only)
 * @returns {Promise} Provider statistics
 */
export const getProvidersStats = () => {
  return httpClient.get(`${DATA_BASE}/admin/providers`);
};

export default {
  // Datasets
  searchDatasets,
  viewDatasetPublic,
  getDatasetById,
  createDataset,
  updateDataset,
  publishDataset,
  getMyDatasets,
  deleteDataset,
  // Categories
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  getCategoryByCode,
  createCategory,
  updateCategory,
  deleteCategory,
  // Ratings
  rateDataset,
  getDatasetRatings,
  getMyRatings,
  deleteRating,
  // Access
  grantAccess,
  getMyAccesses,
  getAccessById,
  recordDownload,
  recordApiCall,
  revokeAccess,
  // Admin
  getAdminStats,
  getAllDatasetsAdmin,
  updateDatasetStatus,
  getAllAccessesAdmin,
  getProvidersStats,
};
