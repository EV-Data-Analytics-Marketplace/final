import React, { useState } from 'react';
import ReportsList from '../../components/analytics/ReportsList';
import PredictionsList from '../../components/analytics/PredictionsList';
import CreateReportForm from '../../components/analytics/CreateReportForm';
import CreatePredictionForm from '../../components/analytics/CreatePredictionForm';
import { useActiveInsights, useInsightManagement } from '../../hooks/analytics/useInsights';

// Mock insights data for providers
const MOCK_INSIGHTS = [
  {
    id: 101,
    title: 'Dataset Download Spike',
    description: 'Your dataset #5 experienced 300% increase in downloads this week. Consider updating pricing or adding premium features.',
    insightType: 'TREND',
    severity: 'HIGH',
    datasetId: 5,
    generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 102,
    title: 'Data Quality Improvement Needed',
    description: 'Dataset #3 received low quality ratings (avg 2.3/5). Review data completeness and accuracy.',
    insightType: 'ALERT',
    severity: 'MEDIUM',
    datasetId: 3,
    generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 103,
    title: 'Revenue Milestone Reached',
    description: 'Congratulations! Your datasets generated $5,000 in revenue this month, achieving 125% of target.',
    insightType: 'SUCCESS',
    severity: 'LOW',
    datasetId: null,
    generatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    validUntil: null,
  },
  {
    id: 104,
    title: 'Recommended Dataset Update',
    description: 'Dataset #7 has not been updated in 90 days. Fresh data could increase consumer interest by 40%.',
    insightType: 'RECOMMENDATION',
    severity: 'MEDIUM',
    datasetId: 7,
    generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const ProviderAnalyticsPage = () => {
  const [refreshReports, setRefreshReports] = useState(0);
  const [refreshPredictions, setRefreshPredictions] = useState(0);
  const { insights: apiInsights, isLoading, error, refetch } = useActiveInsights();
  const { deactivate } = useInsightManagement();
  const [deactivatingId, setDeactivatingId] = useState(null);

  // Use mock data if API fails or returns empty
  const insights = (apiInsights && apiInsights.length > 0) ? apiInsights : MOCK_INSIGHTS;
  const isMockData = !apiInsights || apiInsights.length === 0;

  const handleDeactivate = async (insightId) => {
    if (isMockData) {
      alert('Cannot deactivate mock insights. This is demo data only.');
      return;
    }

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
          <div className="mx-6 my-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">API Error: {error.message}</p>
            <p className="text-sm text-yellow-600 mt-1">Showing mock data for demonstration</p>
          </div>
        ) : null}
        
        {(!isLoading && insights && insights.length > 0) ? (
          <div className="divide-y divide-gray-200">
            {insights.map((insight) => (
              <div key={insight.id} className="px-6 py-4 hover:bg-gray-50">
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
                    disabled={deactivatingId === insight.id || isMockData}
                    className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isMockData ? 'Mock data cannot be deactivated' : 'Deactivate this insight'}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreateReportForm onSuccess={() => setRefreshReports(prev => prev + 1)} />
        <CreatePredictionForm onSuccess={() => setRefreshPredictions(prev => prev + 1)} />
      </div>

      <ReportsList key={refreshReports} />
      <PredictionsList key={refreshPredictions} />
    </div>
  );
};

export default ProviderAnalyticsPage;
