import httpClient from './httpClient';

const BASE_URL = '/analytics/api';

// ========================================
// Analysis Reports API
// ========================================

/**
 * Create a new analysis report
 * @param {Object} reportData - Report creation data
 * @returns {Promise} API response
 */
export const createReport = (reportData) => {
  return httpClient.post(`${BASE_URL}/reports`, reportData);
};

/**
 * Get all reports created by the current user
 * @returns {Promise} API response
 */
export const getMyReports = () => {
  return httpClient.get(`${BASE_URL}/reports/my-reports`);
};

/**
 * Get a specific report by ID
 * @param {number} reportId - Report ID
 * @returns {Promise} API response
 */
export const getReportById = (reportId) => {
  return httpClient.get(`${BASE_URL}/reports/${reportId}`);
};

/**
 * Delete a report
 * @param {number} reportId - Report ID
 * @returns {Promise} API response
 */
export const deleteReport = (reportId) => {
  return httpClient.delete(`${BASE_URL}/reports/${reportId}`);
};

// ========================================
// Dashboards API
// ========================================

/**
 * Create a new dashboard
 * @param {Object} dashboardData - Dashboard creation data
 * @returns {Promise} API response
 */
export const createDashboard = (dashboardData) => {
  return httpClient.post(`${BASE_URL}/dashboards`, dashboardData);
};

/**
 * Update an existing dashboard
 * @param {number} dashboardId - Dashboard ID
 * @param {Object} dashboardData - Dashboard update data
 * @returns {Promise} API response
 */
export const updateDashboard = (dashboardId, dashboardData) => {
  return httpClient.put(`${BASE_URL}/dashboards/${dashboardId}`, dashboardData);
};

/**
 * Get all dashboards created by the current user
 * @returns {Promise} API response
 */
export const getMyDashboards = () => {
  return httpClient.get(`${BASE_URL}/dashboards/my-dashboards`);
};

/**
 * Get all public dashboards
 * @returns {Promise} API response
 */
export const getPublicDashboards = () => {
  return httpClient.get(`${BASE_URL}/dashboards/public`);
};

/**
 * Get a specific dashboard by ID
 * @param {number} dashboardId - Dashboard ID
 * @returns {Promise} API response
 */
export const getDashboardById = (dashboardId) => {
  return httpClient.get(`${BASE_URL}/dashboards/${dashboardId}`);
};

/**
 * Delete a dashboard
 * @param {number} dashboardId - Dashboard ID
 * @returns {Promise} API response
 */
export const deleteDashboard = (dashboardId) => {
  return httpClient.delete(`${BASE_URL}/dashboards/${dashboardId}`);
};

// ========================================
// AI Predictions API
// ========================================

/**
 * Create a new prediction task
 * @param {Object} predictionData - Prediction request data
 * @returns {Promise} API response
 */
export const createPrediction = (predictionData) => {
  return httpClient.post(`${BASE_URL}/predictions`, predictionData);
};

/**
 * Get all predictions created by the current user
 * @returns {Promise} API response
 */
export const getMyPredictions = () => {
  return httpClient.get(`${BASE_URL}/predictions/my-predictions`);
};

/**
 * Get a specific prediction by ID
 * @param {number} predictionId - Prediction ID
 * @returns {Promise} API response
 */
export const getPredictionById = (predictionId) => {
  return httpClient.get(`${BASE_URL}/predictions/${predictionId}`);
};

// ========================================
// Insights API
// ========================================

/**
 * Get all active insights (public endpoint)
 * @returns {Promise} API response
 */
export const getActiveInsights = () => {
  return httpClient.get(`${BASE_URL}/insights/active`);
};

/**
 * Get insights for a specific dataset
 * @param {number} datasetId - Dataset ID
 * @returns {Promise} API response
 */
export const getInsightsByDataset = (datasetId) => {
  return httpClient.get(`${BASE_URL}/insights/dataset/${datasetId}`);
};

/**
 * Deactivate an insight
 * @param {number} insightId - Insight ID
 * @returns {Promise} API response
 */
export const deactivateInsight = (insightId) => {
  return httpClient.post(`${BASE_URL}/insights/${insightId}/deactivate`);
};

// ========================================
// Data Quality API
// ========================================

/**
 * Assess data quality for a dataset
 * @param {number} datasetId - Dataset ID
 * @param {Object} datasetMetrics - Quality metrics
 * @returns {Promise} API response
 */
export const assessDataQuality = (datasetId, datasetMetrics) => {
  return httpClient.post(`${BASE_URL}/quality/assess/${datasetId}`, datasetMetrics);
};

/**
 * Get latest quality assessment for a dataset (public endpoint)
 * @param {number} datasetId - Dataset ID
 * @returns {Promise} API response
 */
export const getLatestQuality = (datasetId) => {
  return httpClient.get(`${BASE_URL}/quality/dataset/${datasetId}/latest`);
};

/**
 * Get datasets with low quality scores
 * @param {number} threshold - Quality score threshold (default: 80.0)
 * @returns {Promise} API response
 */
export const getLowQualityDatasets = (threshold = 80.0) => {
  return httpClient.get(`${BASE_URL}/quality/low-quality`, {
    params: { threshold },
  });
};

// ========================================
// Admin Analytics API
// ========================================

/**
 * Get analytics statistics (ADMIN only)
 * @returns {Promise} API response
 */
export const getAnalyticsStats = () => {
  return httpClient.get(`${BASE_URL}/admin/analytics/stats`);
};

export default {
  // Reports
  createReport,
  getMyReports,
  getReportById,
  deleteReport,
  // Dashboards
  createDashboard,
  updateDashboard,
  getMyDashboards,
  getPublicDashboards,
  getDashboardById,
  deleteDashboard,
  // Predictions
  createPrediction,
  getMyPredictions,
  getPredictionById,
  // Insights
  getActiveInsights,
  getInsightsByDataset,
  deactivateInsight,
  // Quality
  assessDataQuality,
  getLatestQuality,
  getLowQualityDatasets,
  // Admin
  getAnalyticsStats,
};
