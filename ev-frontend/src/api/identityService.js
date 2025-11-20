import httpClient from './httpClient';

const IDENTITY_BASE = '/identity/api';

// ==================== AUTH API ====================

/**
 * Register a new user
 * @param {Object} data - Registration data
 * @param {string} data.email - User email
 * @param {string} data.password - User password
 * @param {string} data.fullName - User full name
 * @param {string} data.role - User role (DATA_CONSUMER, DATA_PROVIDER, ADMIN)
 * @param {string} data.organization - Organization name
 * @param {string} data.phoneNumber - Phone number
 * @returns {Promise} Registration response
 * 
 * @example
 * const data = {
 *   email: "new.consumer@example.com",
 *   password: "password123",
 *   fullName: "New Consumer User",
 *   role: "DATA_CONSUMER",
 *   organization: "Example Corp",
 *   phoneNumber: "0987654321"
 * };
 */
export const register = (data) => {
  return httpClient.post(`${IDENTITY_BASE}/auth/register`, data);
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise} Login response with accessToken and refreshToken
 * 
 * @example
 * const credentials = {
 *   email: "admin@evdata.com",
 *   password: "admin123"
 * };
 */
export const login = (credentials) => {
  return httpClient.post(`${IDENTITY_BASE}/auth/login`, credentials);
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise} New access token and refresh token
 * 
 * @example
 * const refreshToken = "your-refresh-token";
 */
export const refreshToken = (refreshToken) => {
  return httpClient.post(`${IDENTITY_BASE}/auth/refresh-token`, { refreshToken });
};

/**
 * Logout user (requires authentication)
 * @returns {Promise} Logout response
 */
export const logout = () => {
  return httpClient.post(`${IDENTITY_BASE}/auth/logout`);
};

// ==================== USER API ====================

/**
 * Get current user's profile (requires authentication)
 * @returns {Promise} User profile data
 */
export const getMyProfile = () => {
  return httpClient.get(`${IDENTITY_BASE}/users/profile`);
};

/**
 * Update current user's profile (requires authentication)
 * @param {Object} data - Profile update data
 * @param {string} data.email - User email
 * @param {string} data.fullName - Full name
 * @param {string} data.phoneNumber - Phone number
 * @param {string} data.organization - Organization
 * @param {string} data.role - Role
 * @param {string} [data.address] - Address (optional)
 * @param {string} [data.country] - Country (optional)
 * @param {string} [data.city] - City (optional)
 * @returns {Promise} Updated profile data
 * 
 * @example
 * const data = {
 *   email: "consumer@startup.com",
 *   fullName: "Research Team (Updated)",
 *   phoneNumber: "1234567890",
 *   organization: "EV Startup Research",
 *   role: "DATA_CONSUMER",
 *   address: "123 Main St",
 *   country: "USA",
 *   city: "San Francisco"
 * };
 */
export const updateMyProfile = (data) => {
  return httpClient.put(`${IDENTITY_BASE}/users/profile`, data);
};

/**
 * Change current user's password (requires authentication)
 * @param {Object} data - Password change data
 * @param {string} data.currentPassword - Current password
 * @param {string} data.newPassword - New password
 * @returns {Promise} Password change response
 * 
 * @example
 * const data = {
 *   currentPassword: "consumer123",
 *   newPassword: "newPassword456"
 * };
 */
export const changeMyPassword = (data) => {
  return httpClient.put(`${IDENTITY_BASE}/users/change-password`, data);
};

// ==================== ADMIN API ====================

/**
 * Get all users (requires ADMIN role)
 * @returns {Promise} List of all users
 */
export const getAllUsers = () => {
  return httpClient.get(`${IDENTITY_BASE}/admin/users`);
};

/**
 * Get user statistics (requires ADMIN role)
 * @returns {Promise} User statistics
 */
export const getUserStats = () => {
  return httpClient.get(`${IDENTITY_BASE}/admin/users/stats`);
};

/**
 * Get users by role (requires ADMIN role)
 * @param {string} role - User role (DATA_PROVIDER, DATA_CONSUMER, ADMIN)
 * @returns {Promise} List of users with specified role
 * 
 * @example
 * getUsersByRole("DATA_PROVIDER");
 */
export const getUsersByRole = (role) => {
  return httpClient.get(`${IDENTITY_BASE}/admin/users/role/${role}`);
};

/**
 * Get users by status (requires ADMIN role)
 * @param {string} status - User status (ACTIVE, SUSPENDED, etc.)
 * @returns {Promise} List of users with specified status
 * 
 * @example
 * getUsersByStatus("ACTIVE");
 */
export const getUsersByStatus = (status) => {
  return httpClient.get(`${IDENTITY_BASE}/admin/users/status/${status}`);
};

/**
 * Update user status (requires ADMIN role)
 * @param {number} userId - User ID
 * @param {string} status - New status (ACTIVE, SUSPENDED, etc.)
 * @returns {Promise} Updated user data
 * 
 * @example
 * updateUserStatus(2, "SUSPENDED");
 */
export const updateUserStatus = (userId, status) => {
  return httpClient.patch(`${IDENTITY_BASE}/admin/users/${userId}/status?status=${status}`);
};

/**
 * Update user role (requires ADMIN role)
 * @param {number} userId - User ID
 * @param {string} role - New role (ADMIN, DATA_PROVIDER, DATA_CONSUMER)
 * @returns {Promise} Updated user data
 * 
 * @example
 * updateUserRole(3, "ADMIN");
 */
export const updateUserRole = (userId, role) => {
  return httpClient.patch(`${IDENTITY_BASE}/admin/users/${userId}/role?role=${role}`);
};

/**
 * Suspend user (requires ADMIN role)
 * @param {number} userId - User ID
 * @param {string} reason - Suspension reason
 * @returns {Promise} Suspension response
 * 
 * @example
 * suspendUser(2, "Violation");
 */
export const suspendUser = (userId, reason) => {
  return httpClient.post(`${IDENTITY_BASE}/admin/users/${userId}/suspend?reason=${encodeURIComponent(reason)}`);
};

/**
 * Activate user (requires ADMIN role)
 * @param {number} userId - User ID
 * @returns {Promise} Activation response
 * 
 * @example
 * activateUser(2);
 */
export const activateUser = (userId) => {
  return httpClient.post(`${IDENTITY_BASE}/admin/users/${userId}/activate`);
};

/**
 * Delete user (requires ADMIN role)
 * @param {number} userId - User ID
 * @returns {Promise} Deletion response
 * 
 * @example
 * deleteUser(3);
 */
export const deleteUser = (userId) => {
  return httpClient.delete(`${IDENTITY_BASE}/admin/users/${userId}`);
};

/**
 * Get token statistics (requires ADMIN role)
 * @returns {Promise} Token statistics
 */
export const getTokenStats = () => {
  return httpClient.get(`${IDENTITY_BASE}/admin/tokens/stats`);
};

/**
 * Cleanup expired tokens (requires ADMIN role)
 * @returns {Promise} Cleanup response
 */
export const cleanupExpiredTokens = () => {
  return httpClient.delete(`${IDENTITY_BASE}/admin/tokens/cleanup`);
};

export default {
  // Auth
  register,
  login,
  refreshToken,
  logout,
  // User
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  // Admin
  getAllUsers,
  getUserStats,
  getUsersByRole,
  getUsersByStatus,
  updateUserStatus,
  updateUserRole,
  suspendUser,
  activateUser,
  deleteUser,
  getTokenStats,
  cleanupExpiredTokens,
};
