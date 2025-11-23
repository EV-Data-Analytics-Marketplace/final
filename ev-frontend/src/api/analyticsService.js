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

/**
 * Get insights by severity level
 * @param {string} severity - Severity level (HIGH, MEDIUM, LOW)
 * @returns {Promise} API response
 */
export const getInsightsBySeverity = (severity) => {
  return httpClient.get(`${BASE_URL}/insights/severity/${severity}`);
};

/**
 * Get insights by category
 * @param {string} category - Category (BATTERY, CHARGING, PERFORMANCE)
 * @returns {Promise} API response
 */
export const getInsightsByCategory = (category) => {
  return httpClient.get(`${BASE_URL}/insights/category/${category}`);
};

/**
 * Get insights by type
 * @param {string} type - Insight type
 * @returns {Promise} API response
 */
export const getInsightsByType = (type) => {
  return httpClient.get(`${BASE_URL}/insights/type/${type}`);
};

/**
 * Get insight by ID
 * @param {number} insightId - Insight ID
 * @returns {Promise} API response
 */
export const getInsightById = (insightId) => {
  return httpClient.get(`${BASE_URL}/insights/${insightId}`);
};

/**
 * Get insights summary statistics
 * @returns {Promise} API response
 */
export const getInsightsSummary = () => {
  return httpClient.get(`${BASE_URL}/insights/summary`);
};

/**
 * Create manual insight
 * @param {Object} insightData - Insight data
 * @returns {Promise} API response
 */
export const createInsight = (insightData) => {
  return httpClient.post(`${BASE_URL}/insights/create`, insightData);
};

/**
 * Generate insights from report
 * @param {number} reportId - Report ID
 * @returns {Promise} API response
 */
export const generateInsightsFromReport = (reportId) => {
  return httpClient.post(`${BASE_URL}/insights/generate-auto/${reportId}`);
};

/**
 * Activate insight
 * @param {number} insightId - Insight ID
 * @returns {Promise} API response
 */
export const activateInsight = (insightId) => {
  return httpClient.post(`${BASE_URL}/insights/${insightId}/activate`);
};

/**
 * Delete insight (Admin only)
 * @param {number} insightId - Insight ID
 * @returns {Promise} API response
 */
export const deleteInsight = (insightId) => {
  return httpClient.delete(`${BASE_URL}/insights/${insightId}`);
};

// ========================================
// Analytics Metrics API
// ========================================

/**
 * Record single metric
 * @param {Object} metricData - Metric data
 * @returns {Promise} API response
 */
export const recordMetric = (metricData) => {
  return httpClient.post(`${BASE_URL}/metrics/record`, metricData);
};

/**
 * Record batch metrics
 * @param {Array} metricsData - Array of metric data
 * @returns {Promise} API response
 */
export const recordBatchMetrics = (metricsData) => {
  return httpClient.post(`${BASE_URL}/metrics/batch-record`, metricsData);
};

/**
 * Get metrics by entity
 * @param {string} entityType - Entity type (VEHICLE, DATASET, etc.)
 * @param {number} entityId - Entity ID
 * @returns {Promise} API response
 */
export const getMetricsByEntity = (entityType, entityId) => {
  return httpClient.get(`${BASE_URL}/metrics/entity/${entityType}/${entityId}`);
};

/**
 * Get metrics by period
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise} API response
 */
export const getMetricsByPeriod = (entityType, entityId, startDate, endDate) => {
  return httpClient.get(`${BASE_URL}/metrics/period/${entityType}/${entityId}`, {
    params: { startDate, endDate },
  });
};

/**
 * Get average metric
 * @param {string} entityType - Entity type
 * @param {string} metricName - Metric name
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise} API response
 */
export const getAverageMetric = (entityType, metricName, startDate, endDate) => {
  return httpClient.get(`${BASE_URL}/metrics/average/${entityType}/${metricName}`, {
    params: { startDate, endDate },
  });
};

/**
 * Get metrics summary
 * @param {string} entityType - Entity type
 * @param {number} entityId - Entity ID
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise} API response
 */
export const getMetricsSummary = (entityType, entityId, startDate, endDate) => {
  return httpClient.get(`${BASE_URL}/metrics/summary/${entityType}/${entityId}`, {
    params: { startDate, endDate },
  });
};

/**
 * Get metrics by type
 * @param {string} metricType - Metric type (PERFORMANCE, etc.)
 * @returns {Promise} API response
 */
export const getMetricsByType = (metricType) => {
  return httpClient.get(`${BASE_URL}/metrics/type/${metricType}`);
};

// ========================================
// Advanced Analytics API
// ========================================

/**
 * Export report as PDF
 * @param {number} reportId - Report ID
 * @returns {Promise} API response (file download)
 */
export const exportReportPDF = (reportId) => {
  return httpClient.get(`${BASE_URL}/advanced/reports/${reportId}/export/pdf`, {
    responseType: 'blob',
  });
};

/**
 * Export report as Excel
 * @param {number} reportId - Report ID
 * @returns {Promise} API response (file download)
 */
export const exportReportExcel = (reportId) => {
  return httpClient.get(`${BASE_URL}/advanced/reports/${reportId}/export/excel`, {
    responseType: 'blob',
  });
};

/**
 * Export report as CSV
 * @param {number} reportId - Report ID
 * @returns {Promise} API response (file download)
 */
export const exportReportCSV = (reportId) => {
  return httpClient.get(`${BASE_URL}/advanced/reports/${reportId}/export/csv`, {
    responseType: 'blob',
  });
};

/**
 * Compare multiple reports
 * @param {Array<number>} reportIds - Array of report IDs
 * @returns {Promise} API response
 */
export const compareReports = (reportIds) => {
  return httpClient.post(`${BASE_URL}/advanced/reports/compare`, { reportIds });
};

/**
 * Schedule analysis
 * @param {Object} scheduleData - Schedule data
 * @returns {Promise} API response
 */
export const scheduleAnalysis = (scheduleData) => {
  return httpClient.post(`${BASE_URL}/advanced/schedule`, scheduleData);
};

/**
 * Get my schedules
 * @returns {Promise} API response
 */
export const getMySchedules = () => {
  return httpClient.get(`${BASE_URL}/advanced/schedule/my-schedules`);
};

/**
 * Update schedule
 * @param {number} scheduleId - Schedule ID
 * @param {Object} scheduleData - Schedule data
 * @returns {Promise} API response
 */
export const updateSchedule = (scheduleId, scheduleData) => {
  return httpClient.put(`${BASE_URL}/advanced/schedule/${scheduleId}`, scheduleData);
};

/**
 * Toggle schedule (pause/resume)
 * @param {number} scheduleId - Schedule ID
 * @returns {Promise} API response
 */
export const toggleSchedule = (scheduleId) => {
  return httpClient.patch(`${BASE_URL}/advanced/schedule/${scheduleId}/toggle`);
};

/**
 * Delete schedule
 * @param {number} scheduleId - Schedule ID
 * @returns {Promise} API response
 */
export const deleteSchedule = (scheduleId) => {
  return httpClient.delete(`${BASE_URL}/advanced/schedule/${scheduleId}`);
};

/**
 * Get trending insights
 * @param {number} days - Number of days to look back
 * @returns {Promise} API response
 */
export const getTrendingInsights = (days = 7) => {
  return httpClient.get(`${BASE_URL}/advanced/insights/trending`, {
    params: { days },
  });
};

/**
 * Get performance benchmarks
 * @param {number} datasetId - Dataset ID
 * @returns {Promise} API response
 */
export const getPerformanceBenchmarks = (datasetId) => {
  return httpClient.get(`${BASE_URL}/advanced/benchmarks/${datasetId}`);
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
  return httpClient.post(`${BASE_URL}/data-quality/assess/${datasetId}`, datasetMetrics);
};

/**
 * Get latest quality assessment for a dataset (public endpoint)
 * @param {number} datasetId - Dataset ID
 * @returns {Promise} API response
 */
export const getLatestQuality = (datasetId) => {
  return httpClient.get(`${BASE_URL}/data-quality/dataset/${datasetId}/latest`);
};

/**
 * Get datasets with low quality scores
 * @param {number} threshold - Quality score threshold (default: 80.0)
 * @returns {Promise} API response
 */
export const getLowQualityDatasets = (threshold = 80.0) => {
  return httpClient.get(`${BASE_URL}/data-quality/low-quality`, {
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
  getInsightsBySeverity,
  getInsightsByCategory,
  getInsightsByType,
  getInsightById,
  getInsightsSummary,
  createInsight,
  generateInsightsFromReport,
  deactivateInsight,
  activateInsight,
  deleteInsight,
  // Metrics
  recordMetric,
  recordBatchMetrics,
  getMetricsByEntity,
  getMetricsByPeriod,
  getAverageMetric,
  getMetricsSummary,
  getMetricsByType,
  // Advanced Analytics
  exportReportPDF,
  exportReportExcel,
  exportReportCSV,
  compareReports,
  scheduleAnalysis,
  getMySchedules,
  updateSchedule,
  toggleSchedule,
  deleteSchedule,
  getTrendingInsights,
  getPerformanceBenchmarks,
  // Quality
  assessDataQuality,
  getLatestQuality,
  getLowQualityDatasets,
  // Admin
  getAnalyticsStats,
};
