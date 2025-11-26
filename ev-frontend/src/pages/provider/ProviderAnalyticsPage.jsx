import React, { useState } from 'react';
import ReportsList from '../../components/analytics/ReportsList';
import PredictionsList from '../../components/analytics/PredictionsList';
import { useActiveInsights, useInsightManagement } from '../../hooks/analytics/useInsights';

const ProviderAnalyticsPage = () => {
  const [refreshReports, setRefreshReports] = useState(0);
  const [refreshPredictions, setRefreshPredictions] = useState(0);
  const { insights, isLoading, error, refetch } = useActiveInsights();
  const { deactivate } = useInsightManagement();
  const [deactivatingId, setDeactivatingId] = useState(null);

  const handleDeactivate = async (insightId) => {
    if (!window.confirm('Are you sure you want to deactivate this insight?')) {
      return;
    }

    setDeactivatingId(insightId);
    try {
      await deactivate(insightId);
      alert('Insight deactivated successfully');
      refetch();
    } catch (err) {
      alert('Failed to deactivate insight: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeactivatingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Analyze your dataset performance and insights</p>
      </div>

      {/* Active Insights Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Active Insights</h2>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="mx-6 my-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">Error: {error.message}</p>
          </div>
        ) : null}
        
        {(!isLoading && insights && insights.length > 0) ? (
          <div className="divide-y divide-gray-200">
            {insights.map((insight, index) => (
              <div key={`insight-${insight.id}-${index}`} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{insight.title}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {insight.insightType}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        insight.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                        insight.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {insight.severity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{insight.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      {insight.datasetId && <span>Dataset ID: {insight.datasetId}</span>}
                      {insight.datasetId && <span>•</span>}
                      <span>Generated: {formatDate(insight.generatedAt)}</span>
                      {insight.validUntil && (
                        <>
                          <span>•</span>
                          <span>Valid Until: {formatDate(insight.validUntil)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeactivate(insight.id)}
                    disabled={deactivatingId === insight.id}
                    className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deactivatingId === insight.id ? 'Deactivating...' : 'Deactivate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="text-lg">No active insights available</p>
          </div>
        )}
      </div>

      <ReportsList key={`reports-${refreshReports}`} />
      <PredictionsList key={`predictions-${refreshPredictions}`} />
    </div>
  );
};

export default ProviderAnalyticsPage;
