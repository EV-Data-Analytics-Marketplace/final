import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserStats } from '../../hooks/identity/useUsers';
import { useDataAdminStats } from '../../hooks/data/useDataAdmin';
import { usePaymentStats } from '../../hooks/payment/usePaymentAdmin';
import { useReports } from '../../hooks/analytics/useReports';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { stats: userStats, isLoading: userStatsLoading } = useUserStats();
  const { stats: dataStats, isLoading: dataStatsLoading } = useDataAdminStats();
  const { stats: paymentStats, isLoading: paymentStatsLoading } = usePaymentStats();
  const { reports, isLoading: reportsLoading } = useReports();

  // Helper function for currency formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalUsers = userStats?.totalUsers || 0;
    const totalDatasets = dataStats?.totalDatasets || 0;
    const monthlyRevenue = paymentStats?.monthlyRevenue || 0;
    const activeReports = reports?.filter(r => r.status === 'COMPLETED').length || 0;

    return [
      { title: 'Total Users', value: totalUsers.toLocaleString(), icon: '👥', color: 'bg-blue-500' },
      { title: 'Total Datasets', value: totalDatasets.toLocaleString(), icon: '💾', color: 'bg-green-500' },
      { title: 'Revenue (Month)', value: formatCurrency(monthlyRevenue), icon: '💰', color: 'bg-yellow-500' },
      { title: 'Active Reports', value: activeReports, icon: '📊', color: 'bg-purple-500' },
    ];
  }, [userStats, dataStats, paymentStats, reports]);

  const quickActions = [
    { title: 'User Management', path: '/admin/users', icon: '👥' },
    { title: 'Data Management', path: '/admin/data', icon: '💾' },
    { title: 'Payment Management', path: '/admin/payments', icon: '💳' },
    { title: 'Analytics', path: '/admin/analytics', icon: '📈' },
  ];

  const isLoading = userStatsLoading || dataStatsLoading || paymentStatsLoading || reportsLoading;

  // Get recent activity from reports
  const recentActivity = useMemo(() => {
    if (!reports || reports.length === 0) return [];
    
    return reports
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(report => {
        const date = new Date(report.createdAt);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let timeAgo;
        if (diffMins < 60) {
          timeAgo = diffMins <= 1 ? '1 minute ago' : `${diffMins} minutes ago`;
        } else if (diffHours < 24) {
          timeAgo = diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
        } else {
          timeAgo = diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
        }

        return {
          action: `Report generated: ${report.name}`,
          time: timeAgo,
          type: report.status === 'COMPLETED' ? 'success' : 'pending',
        };
      });
  }, [reports]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="text-blue-100">{user?.email}</p>
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

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        {reportsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-gray-900">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
