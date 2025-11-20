import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProviderDashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'My Datasets', value: '12', icon: '💾', color: 'bg-green-500' },
    { title: 'Total Revenue', value: '$8,450', icon: '💰', color: 'bg-yellow-500' },
    { title: 'Downloads', value: '1,234', icon: '⬇️', color: 'bg-blue-500' },
    { title: 'Avg Rating', value: '4.8', icon: '⭐', color: 'bg-purple-500' },
  ];

  const quickActions = [
    { title: 'Upload Dataset', path: '/provider/datasets', icon: '⬆️' },
    { title: 'View Revenue', path: '/provider/revenue', icon: '💰' },
    { title: 'Analytics', path: '/provider/analytics', icon: '📊' },
    { title: 'Edit Profile', path: '/provider/profile', icon: '👤' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, Provider!</h1>
        <p className="text-green-100">{user?.fullName || user?.email}</p>
        <p className="text-sm text-green-200 mt-2">Manage your datasets and track revenue</p>
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
        <div className="space-y-3">
          {[
            { name: 'EV Battery Performance Data', status: 'Published', downloads: 234 },
            { name: 'Charging Station Usage', status: 'Published', downloads: 189 },
            { name: 'Range Analysis Dataset', status: 'Draft', downloads: 0 },
          ].map((dataset, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
              <div>
                <h3 className="font-medium text-gray-900">{dataset.name}</h3>
                <p className="text-sm text-gray-500">{dataset.downloads} downloads</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                dataset.status === 'Published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {dataset.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboardPage;
