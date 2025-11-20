import httpClient from './httpClient';

const PAYMENT_BASE = '/payment/api';

// ==================== TRANSACTION API ====================

/**
 * Create a new transaction (purchase dataset)
 * @param {Object} transactionData - Transaction data
 * @param {number} transactionData.datasetId - Dataset ID
 * @param {string} transactionData.transactionType - Transaction type (PURCHASE, REFUND)
 * @param {number} transactionData.amount - Amount
 * @param {string} transactionData.paymentMethod - Payment method (CREDIT_CARD, PAYPAL, etc.)
 * @param {number} transactionData.paymentMethodId - Payment method ID
 * @param {number} [transactionData.subscriptionDays] - Subscription duration in days
 * @param {number} [transactionData.apiCallsLimit] - API calls limit
 * @param {string} [transactionData.notes] - Optional notes
 * @returns {Promise} Created transaction
 * 
 * @example
 * const transactionData = {
 *   datasetId: 1,
 *   transactionType: "PURCHASE",
 *   amount: 99.99,
 *   paymentMethod: "CREDIT_CARD",
 *   paymentMethodId: 1,
 *   notes: "Test purchase"
 * };
 */
export const createTransaction = (transactionData) => {
  return httpClient.post(`${PAYMENT_BASE}/transactions`, transactionData);
};

/**
 * Get current user's transactions
 * @returns {Promise} List of user's transactions
 */
export const getMyTransactions = () => {
  return httpClient.get(`${PAYMENT_BASE}/transactions/my-transactions`);
};

/**
 * Get transactions as consumer
 * @returns {Promise} List of consumer transactions
 */
export const getConsumerTransactions = () => {
  return httpClient.get(`${PAYMENT_BASE}/transactions/consumer`);
};

/**
 * Get transactions as provider
 * @returns {Promise} List of provider transactions
 */
export const getProviderTransactions = () => {
  return httpClient.get(`${PAYMENT_BASE}/transactions/provider`);
};

/**
 * Get transaction by ID
 * @param {number} transactionId - Transaction ID
 * @returns {Promise} Transaction details
 */
export const getTransactionById = (transactionId) => {
  return httpClient.get(`${PAYMENT_BASE}/transactions/${transactionId}`);
};

/**
 * Get transaction by reference
 * @param {string} transactionRef - Transaction reference ID
 * @returns {Promise} Transaction details
 */
export const getTransactionByRef = (transactionRef) => {
  return httpClient.get(`${PAYMENT_BASE}/transactions/ref/${transactionRef}`);
};

// ==================== PAYMENT METHOD API ====================

/**
 * Add a new payment method
 * @param {Object} paymentMethodData - Payment method data
 * @param {string} paymentMethodData.type - Payment type (CREDIT_CARD, PAYPAL, etc.)
 * @param {string} [paymentMethodData.cardNumber] - Card number (for credit card)
 * @param {string} [paymentMethodData.cardHolderName] - Card holder name
 * @param {string} [paymentMethodData.cardExpMonth] - Expiration month
 * @param {string} [paymentMethodData.cardExpYear] - Expiration year
 * @param {string} [paymentMethodData.cardCvv] - CVV code
 * @param {boolean} [paymentMethodData.isDefault] - Set as default
 * @returns {Promise} Created payment method
 * 
 * @example
 * const paymentMethodData = {
 *   type: "CREDIT_CARD",
 *   cardNumber: "4111222233334444",
 *   cardHolderName: "Test User",
 *   cardExpMonth: "12",
 *   cardExpYear: "2028",
 *   cardCvv: "123",
 *   isDefault: true
 * };
 */
export const addPaymentMethod = (paymentMethodData) => {
  return httpClient.post(`${PAYMENT_BASE}/payment-methods`, paymentMethodData);
};

/**
 * Get user's payment methods
 * @returns {Promise} List of payment methods
 */
export const getMyPaymentMethods = () => {
  return httpClient.get(`${PAYMENT_BASE}/payment-methods`);
};

/**
 * Set payment method as default
 * @param {number} paymentMethodId - Payment method ID
 * @returns {Promise} Updated payment method
 */
export const setDefaultPaymentMethod = (paymentMethodId) => {
  return httpClient.patch(`${PAYMENT_BASE}/payment-methods/${paymentMethodId}/set-default`);
};

/**
 * Delete payment method
 * @param {number} paymentMethodId - Payment method ID
 * @returns {Promise} Deletion response
 */
export const deletePaymentMethod = (paymentMethodId) => {
  return httpClient.delete(`${PAYMENT_BASE}/payment-methods/${paymentMethodId}`);
};

// ==================== REFUND API ====================

/**
 * Create a refund request
 * @param {Object} refundData - Refund request data
 * @param {number} refundData.transactionId - Transaction ID
 * @param {number} refundData.amount - Refund amount
 * @param {string} refundData.reason - Refund reason (CUSTOMER_REQUEST, QUALITY_ISSUE, etc.)
 * @param {string} [refundData.description] - Optional description
 * @returns {Promise} Created refund request
 * 
 * @example
 * const refundData = {
 *   transactionId: 1,
 *   amount: 50.00,
 *   reason: "CUSTOMER_REQUEST",
 *   description: "Not satisfied with dataset quality"
 * };
 */
export const createRefundRequest = (refundData) => {
  return httpClient.post(`${PAYMENT_BASE}/refunds`, refundData);
};

/**
 * Get user's refund requests
 * @returns {Promise} List of refund requests
 */
export const getMyRefunds = () => {
  return httpClient.get(`${PAYMENT_BASE}/refunds/my-refunds`);
};

/**
 * Approve refund (ADMIN only)
 * @param {number} refundId - Refund ID
 * @returns {Promise} Approved refund
 */
export const approveRefund = (refundId) => {
  return httpClient.post(`${PAYMENT_BASE}/refunds/${refundId}/approve`);
};

/**
 * Reject refund (ADMIN only)
 * @param {number} refundId - Refund ID
 * @param {string} reason - Rejection reason
 * @returns {Promise} Rejected refund
 */
export const rejectRefund = (refundId, reason) => {
  return httpClient.post(`${PAYMENT_BASE}/refunds/${refundId}/reject?reason=${encodeURIComponent(reason)}`);
};

// ==================== PROVIDER REVENUE API ====================

/**
 * Get provider's revenue (requires DATA_PROVIDER role)
 * @returns {Promise} Provider revenue data
 */
export const getMyRevenue = () => {
  return httpClient.get(`${PAYMENT_BASE}/revenue/my-revenue`);
};

/**
 * Get revenue by month (requires DATA_PROVIDER role)
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {Promise} Monthly revenue data
 * 
 * @example
 * getRevenueByMonth(2024, 10);
 */
export const getRevenueByMonth = (year, month) => {
  return httpClient.get(`${PAYMENT_BASE}/revenue/month?year=${year}&month=${month}`);
};

/**
 * Get total earnings (requires DATA_PROVIDER role)
 * @returns {Promise} Total earnings data
 */
export const getTotalEarnings = () => {
  return httpClient.get(`${PAYMENT_BASE}/revenue/total-earnings`);
};

// ==================== ADMIN PAYMENT API ====================

/**
 * Get payment statistics (ADMIN only)
 * @returns {Promise} Payment statistics
 */
export const getPaymentStats = () => {
  return httpClient.get(`${PAYMENT_BASE}/admin/payment/stats`);
};

/**
 * Get all transactions with optional status filter (ADMIN only)
 * @param {string} [status] - Filter by status (COMPLETED, PENDING, FAILED)
 * @returns {Promise} List of all transactions
 */
export const getAllTransactions = (status = null) => {
  const url = status
    ? `${PAYMENT_BASE}/admin/payment/transactions?status=${status}`
    : `${PAYMENT_BASE}/admin/payment/transactions`;
  return httpClient.get(url);
};

/**
 * Get all refunds with optional status filter (ADMIN only)
 * @param {string} [status] - Filter by status (PENDING, APPROVED, REJECTED)
 * @returns {Promise} List of all refunds
 */
export const getAllRefunds = (status = null) => {
  const url = status
    ? `${PAYMENT_BASE}/admin/payment/refunds?status=${status}`
    : `${PAYMENT_BASE}/admin/payment/refunds`;
  return httpClient.get(url);
};

/**
 * Get all provider revenues (ADMIN only)
 * @returns {Promise} List of all provider revenues
 */
export const getAllProviderRevenues = () => {
  return httpClient.get(`${PAYMENT_BASE}/admin/payment/provider-revenues`);
};

/**
 * Calculate monthly revenue (ADMIN only)
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {Promise} Calculation result
 */
export const calculateMonthlyRevenue = (year, month) => {
  return httpClient.post(`${PAYMENT_BASE}/admin/payment/calculate-monthly-revenue?year=${year}&month=${month}`);
};

/**
 * Pay provider revenue (ADMIN only)
 * @param {number} revenueId - Revenue ID
 * @returns {Promise} Payment result
 */
export const payProviderRevenue = (revenueId) => {
  return httpClient.post(`${PAYMENT_BASE}/admin/payment/pay-revenue/${revenueId}`);
};

export default {
  // Transactions
  createTransaction,
  getMyTransactions,
  getConsumerTransactions,
  getProviderTransactions,
  getTransactionById,
  getTransactionByRef,
  // Payment Methods
  addPaymentMethod,
  getMyPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  // Refunds
  createRefundRequest,
  getMyRefunds,
  approveRefund,
  rejectRefund,
  // Provider Revenue
  getMyRevenue,
  getRevenueByMonth,
  getTotalEarnings,
  // Admin
  getPaymentStats,
  getAllTransactions,
  getAllRefunds,
  getAllProviderRevenues,
  calculateMonthlyRevenue,
  payProviderRevenue,
};
