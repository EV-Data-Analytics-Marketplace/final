import React from 'react';
import { useAnalyticsStats } from '../../hooks/analytics/useAnalyticsAdmin';

const AnalyticsStatsCard = () => {
  const { stats, isLoading, error, refetch } = useAnalyticsStats();

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Analytics Statistics</h2>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Retry
          </button>
        </div>
        <div className="p-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-center text-gray-500">No statistics available</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Reports', value: stats.totalReports || 0, color: 'blue' },
    { label: 'Total Dashboards', value: stats.totalDashboards || 0, color: 'green' },
    { label: 'Total Predictions', value: stats.totalPredictions || 0, color: 'purple' },
    { label: 'Total Insights', value: stats.totalInsights || 0, color: 'yellow' },
    { label: 'Active Insights', value: stats.activeInsights || 0, color: 'indigo' },
    { label: 'Quality Assessments', value: stats.qualityAssessments || 0, color: 'pink' },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Analytics Statistics</h2>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Refresh
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-4`}
            >
              <p className={`text-sm font-medium text-${stat.color}-600`}>{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-900 mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {stats.avgQualityScore !== undefined && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Average Quality Score</span>
              <span className="text-2xl font-bold text-gray-900">
                {stats.avgQualityScore.toFixed(2)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  stats.avgQualityScore >= 90
                    ? 'bg-green-500'
                    : stats.avgQualityScore >= 70
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${stats.avgQualityScore}%` }}
              ></div>
            </div>
          </div>
        )}

        {stats.recentActivity && stats.recentActivity.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{activity.description}</span>
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsStatsCard;
