import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMyAccesses } from '../../hooks/data/useAccess';
import { useTransactions } from '../../hooks/payment/useTransactions';
import { useSearchDatasets } from '../../hooks/data/useSearchDatasets';

const ConsumerDashboardPage = () => {
  const { user } = useAuth();
  const { accesses, isLoading: accessesLoading } = useMyAccesses();
  const { transactions, isLoading: transactionsLoading } = useTransactions('consumer');
  const { datasets: recommendedDatasets, isLoading: datasetsLoading } = useSearchDatasets({
    pricingModel: null,
    page: 0,
    size: 3,
  });

  // Helper functions - must be defined before useMemo
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Calculate stats from real data
  const stats = useMemo(() => {
    const purchasedCount = accesses?.length || 0;
    const totalSpent = transactions?.reduce((sum, t) => {
      if (t.transactionType === 'PURCHASE' && t.status === 'COMPLETED') {
        return sum + (t.amount || 0);
      }
      return sum;
    }, 0) || 0;
    
    const totalDownloads = accesses?.reduce((sum, access) => {
      return sum + (access.downloadCount || 0);
    }, 0) || 0;

    const completedTransactions = transactions?.filter(
      t => t.status === 'COMPLETED'
    ).length || 0;

    return [
      { title: 'Purchased Datasets', value: purchasedCount, icon: '💾', color: 'bg-blue-500' },
      { title: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: '💳', color: 'bg-green-500' },
      { title: 'Downloads', value: totalDownloads, icon: '⬇️', color: 'bg-purple-500' },
      { title: 'Transactions', value: completedTransactions, icon: '📊', color: 'bg-yellow-500' },
    ];
  }, [accesses, transactions]);

  const quickActions = [
    { title: 'Browse Datasets', path: '/consumer/browse', icon: '🔍' },
    { title: 'My Purchases', path: '/consumer/purchases', icon: '🛒' },
    { title: 'Transactions', path: '/consumer/transactions', icon: '💳' },
    { title: 'Analytics', path: '/consumer/analytics', icon: '📊' },
  ];

  // Get recent purchases from transactions
  const recentPurchases = useMemo(() => {
    if (!transactions) return [];
    return transactions
      .filter(t => t.transactionType === 'PURCHASE' && t.status === 'COMPLETED')
      .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
      .slice(0, 3)
      .map(t => ({
        id: t.id,
        name: `Dataset #${t.datasetId}`,
        price: `$${t.amount.toFixed(2)}`,
        date: formatDate(t.transactionDate),
      }));
  }, [transactions]);

  const isLoading = accessesLoading || transactionsLoading || datasetsLoading;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, Consumer!</h1>
        <p className="text-blue-100">{user?.fullName || user?.email}</p>
        <p className="text-sm text-blue-200 mt-2">Discover and analyze EV datasets</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            {isLoading ? (
              <div className="mt-2 h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <h3 className="font-semibold text-gray-900">{action.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* My Purchases */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Purchases</h2>
          <Link to="/consumer/purchases" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        {transactionsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ) : recentPurchases.length > 0 ? (
          <div className="space-y-3">
            {recentPurchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                <div>
                  <h3 className="font-medium text-gray-900">{purchase.name}</h3>
                  <p className="text-sm text-gray-500">{purchase.date}</p>
                </div>
                <span className="text-green-600 font-semibold">{purchase.price}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No purchases yet</p>
            <Link to="/consumer/browse" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
              Browse Datasets →
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Datasets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>
        {datasetsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ) : recommendedDatasets?.content?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedDatasets.content.map((dataset) => (
              <div key={dataset.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2 truncate">{dataset.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{dataset.categoryId ? `Category ${dataset.categoryId}` : 'Uncategorized'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-bold">
                    {dataset.pricingModel === 'FREE' ? 'FREE' : formatCurrency(dataset.price)}
                  </span>
                  <Link
                    to={`/consumer/dataset/${dataset.id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No datasets available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerDashboardPage;
