import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ConsumerDashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Purchased Datasets', value: '8', icon: '💾', color: 'bg-blue-500' },
    { title: 'Total Spent', value: '$2,350', icon: '💳', color: 'bg-green-500' },
    { title: 'Downloads', value: '24', icon: '⬇️', color: 'bg-purple-500' },
    { title: 'Reports Created', value: '15', icon: '📊', color: 'bg-yellow-500' },
  ];

  const quickActions = [
    { title: 'Browse Datasets', path: '/consumer/browse', icon: '🔍' },
    { title: 'My Purchases', path: '/consumer/purchases', icon: '🛒' },
    { title: 'Transactions', path: '/consumer/transactions', icon: '💳' },
    { title: 'Analytics', path: '/consumer/analytics', icon: '📊' },
  ];

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
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
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
        <div className="space-y-3">
          {[
            { name: 'EV Battery Performance Data', price: '$299', date: '2 days ago' },
            { name: 'Charging Station Usage', price: '$199', date: '5 days ago' },
            { name: 'Range Analysis Dataset', price: '$349', date: '1 week ago' },
          ].map((purchase, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
              <div>
                <h3 className="font-medium text-gray-900">{purchase.name}</h3>
                <p className="text-sm text-gray-500">{purchase.date}</p>
              </div>
              <span className="text-green-600 font-semibold">{purchase.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Datasets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Predictive Maintenance Data', category: 'Maintenance', price: '$249' },
            { name: 'Energy Consumption Patterns', category: 'Energy', price: '$179' },
            { name: 'Driving Behavior Analysis', category: 'Behavior', price: '$299' },
          ].map((dataset, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">{dataset.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{dataset.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-bold">{dataset.price}</span>
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboardPage;
