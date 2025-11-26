import React, { useState } from 'react';
import PredictionsList from '../../components/analytics/PredictionsList';

const ConsumerAnalyticsPage = () => {
  const [refreshPredictions, setRefreshPredictions] = useState(0);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Predictions</h1>
        <p className="text-gray-600 mt-1">Create and view AI predictions for your data</p>
      </div>
      
      <PredictionsList key={refreshPredictions} />
    </div>
  );
};

export default ConsumerAnalyticsPage;
