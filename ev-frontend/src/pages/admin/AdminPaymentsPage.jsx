import React, { useState } from 'react';
import { usePaymentAdminStats, useAllTransactions, useAllRefunds, useAllProviderRevenues, usePaymentAdminOperations } from '../../hooks/payment/usePaymentAdmin';

const AdminPaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-600 mt-1">Monitor transactions, refunds, and provider revenues</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`${
              activeTab === 'transactions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('refunds')}
            className={`${
              activeTab === 'refunds'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Refunds
          </button>
          <button
            onClick={() => setActiveTab('revenues')}
            className={`${
              activeTab === 'revenues'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Provider Revenues
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <PaymentOverview />}
      {activeTab === 'transactions' && <TransactionsTab />}
      {activeTab === 'refunds' && <RefundsTab />}
      {activeTab === 'revenues' && <RevenuesTab />}
    </div>
  );
};

// Overview Tab Component
const PaymentOverview = () => {
  const { stats, isLoading, error } = usePaymentAdminStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error.message}</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
              <dd className="text-lg font-semibold text-gray-900">{formatCurrency(stats?.totalRevenue)}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Completed Transactions</dt>
              <dd className="text-lg font-semibold text-gray-900">{stats?.completedTransactions || 0}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Pending Refunds</dt>
              <dd className="text-lg font-semibold text-gray-900">{stats?.pendingRefunds || 0}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Unpaid Revenues</dt>
              <dd className="text-lg font-semibold text-gray-900">{stats?.unpaidRevenues || 0}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// Transactions Tab Component
const TransactionsTab = () => {
  const [statusFilter, setStatusFilter] = useState(null);
  const { transactions, isLoading, refetch } = useAllTransactions(statusFilter);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      COMPLETED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      FAILED: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">All Transactions</h2>
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {transactions && transactions.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consumer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dataset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{transaction.transactionRef}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ID: {transaction.consumerId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ID: {transaction.datasetId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(transaction.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(transaction.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.transactionDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="text-lg">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Refunds Tab Component  
const RefundsTab = () => {
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const { refunds, isLoading, refetch } = useAllRefunds(statusFilter);
  const { approveRefund, rejectRefund } = usePaymentAdminOperations();
  const [processingId, setProcessingId] = useState(null);

  const handleApprove = async (refundId) => {
    if (!window.confirm('Are you sure you want to approve this refund?')) return;
    
    setProcessingId(refundId);
    try {
      await approveRefund(refundId);
      alert('Refund approved successfully');
      refetch();
    } catch (err) {
      alert('Failed to approve refund: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (refundId) => {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;
    
    setProcessingId(refundId);
    try {
      await rejectRefund(refundId, reason);
      alert('Refund rejected successfully');
      refetch();
    } catch (err) {
      alert('Failed to reject refund: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Refund Requests</h2>
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button onClick={refetch} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {refunds && refunds.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {refunds.map((refund) => (
                <tr key={refund.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{refund.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{refund.transactionId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(refund.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{refund.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(refund.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(refund.requestedAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {refund.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApprove(refund.id)}
                          disabled={processingId === refund.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(refund.id)}
                          disabled={processingId === refund.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="text-lg">No refund requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Revenues Tab Component
const RevenuesTab = () => {
  const { revenues, isLoading, refetch } = useAllProviderRevenues();
  const { payRevenue } = usePaymentAdminOperations();
  const [payingId, setPayingId] = useState(null);

  const handlePayRevenue = async (revenueId) => {
    if (!window.confirm('Are you sure you want to mark this revenue as paid?')) return;

    setPayingId(revenueId);
    try {
      await payRevenue(revenueId);
      alert('Revenue marked as paid successfully');
      refetch();
    } catch (err) {
      alert('Failed to pay revenue: ' + (err.response?.data?.message || err.message));
    } finally {
      setPayingId(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Provider Revenues</h2>
        <button onClick={refetch} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        {revenues && revenues.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenues.map((revenue) => (
                <tr key={revenue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{revenue.providerId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{months[revenue.month - 1]} {revenue.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(revenue.totalRevenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(revenue.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{revenue.paidAt ? formatDate(revenue.paidAt) : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {revenue.status === 'PENDING' && (
                      <button
                        onClick={() => handlePayRevenue(revenue.id)}
                        disabled={payingId === revenue.id}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                      >
                        {payingId === revenue.id ? 'Paying...' : 'Mark as Paid'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="text-lg">No provider revenues found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
