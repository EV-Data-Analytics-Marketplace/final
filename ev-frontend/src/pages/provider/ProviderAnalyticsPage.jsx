import React from 'react';
import ReportsList from '../../components/analytics/ReportsList';
import PredictionsList from '../../components/analytics/PredictionsList';
import CreateReportForm from '../../components/analytics/CreateReportForm';
import CreatePredictionForm from '../../components/analytics/CreatePredictionForm';
import AssessDataQualityForm from '../../components/analytics/AssessDataQualityForm';

const ProviderAnalyticsPage = () => {
  const [refreshReports, setRefreshReports] = React.useState(0);
  const [refreshPredictions, setRefreshPredictions] = React.useState(0);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Analyze your dataset performance and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreateReportForm onSuccess={() => setRefreshReports(prev => prev + 1)} />
        <CreatePredictionForm onSuccess={() => setRefreshPredictions(prev => prev + 1)} />
      </div>

      <AssessDataQualityForm />

      <ReportsList key={refreshReports} />
      <PredictionsList key={refreshPredictions} />
    </div>
  );
};

export default ProviderAnalyticsPage;
