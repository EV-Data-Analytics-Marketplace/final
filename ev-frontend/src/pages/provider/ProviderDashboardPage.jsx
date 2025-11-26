import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMyDatasets } from '../../hooks/data/useMyDatasets';
import { useTotalEarnings } from '../../hooks/payment/useRevenue';

const ProviderDashboardPage = () => {
  const { user } = useAuth();
  const { datasets, isLoading: datasetsLoading, refetch: refetchDatasets } = useMyDatasets();
  const { earnings, isLoading: earningsLoading, refetch: refetchEarnings } = useTotalEarnings();

  // Auto-refresh revenue every 30 seconds to catch new purchases
  useEffect(() => {
    const interval = setInterval(() => {
      refetchEarnings();
      refetchDatasets(); // Also refresh datasets for download counts
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [refetchEarnings, refetchDatasets]);

  // Refresh when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetchEarnings();
        refetchDatasets();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refetchEarnings, refetchDatasets]);

  // Helper function for currency formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Calculate stats from real data
  const stats = useMemo(() => {
    const datasetCount = datasets?.length || 0;
    const totalRevenue = earnings?.totalEarnings || 0;
    
    const totalDownloads = datasets?.reduce((sum, dataset) => {
      return sum + (dataset.downloadCount || 0);
    }, 0) || 0;

    const avgRating = datasets?.length > 0 
      ? (datasets.reduce((sum, dataset) => sum + (dataset.averageRating || 0), 0) / datasets.length).toFixed(1)
      : '0.0';

    return [
      { title: 'My Datasets', value: datasetCount, icon: '💾', color: 'bg-green-500' },
      { title: 'Total Revenue', value: formatCurrency(totalRevenue), icon: '💰', color: 'bg-yellow-500' },
      { title: 'Downloads', value: totalDownloads.toLocaleString(), icon: '⬇️', color: 'bg-blue-500' },
      { title: 'Avg Rating', value: avgRating, icon: '⭐', color: 'bg-purple-500' },
    ];
  }, [datasets, earnings]);

  const quickActions = [
    { title: 'Upload Dataset', path: '/provider/datasets', icon: '⬆️' },
    { title: 'View Revenue', path: '/provider/revenue', icon: '💰' },
    { title: 'Analytics', path: '/provider/analytics', icon: '📊' },
    { title: 'Edit Profile', path: '/provider/profile', icon: '👤' },
  ];

  const isLoading = datasetsLoading || earningsLoading;

  // Get recent datasets from real data
  const recentDatasets = useMemo(() => {
    if (!datasets) return [];
    return [...datasets]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(d => ({
        id: d.id,
        name: d.name,
        downloads: d.downloadCount || 0,
        status: d.status,
      }));
  }, [datasets]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, Provider!</h1>
            <p className="text-green-100">{user?.fullName || user?.email}</p>
            <p className="text-sm text-green-200 mt-2">Manage your datasets and track revenue</p>
          </div>
          <button
            onClick={() => {
              console.log('Manual refresh triggered');
              refetchEarnings();
              refetchDatasets();
            }}
            className="px-4 py-2 bg-white text-green-700 rounded-md hover:bg-green-50 transition-colors flex items-center gap-2"
            title="Refresh revenue data"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
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
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <h3 className="font-semibold text-gray-900">{action.title}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* My Datasets Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">My Datasets</h2>
          <Link to="/provider/datasets" className="text-green-600 hover:text-green-700 font-medium">
            View All →
          </Link>
        </div>
        {datasetsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ) : recentDatasets.length > 0 ? (
          <div className="space-y-3">
            {recentDatasets.map((dataset) => (
              <div key={dataset.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                <div>
                  <h3 className="font-medium text-gray-900">{dataset.name}</h3>
                  <p className="text-sm text-gray-500">{dataset.downloads} downloads</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  dataset.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800' 
                    : dataset.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {dataset.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No datasets yet</p>
            <Link to="/provider/datasets" className="text-green-600 hover:text-green-700 mt-2 inline-block">
              Upload Your First Dataset →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboardPage;
