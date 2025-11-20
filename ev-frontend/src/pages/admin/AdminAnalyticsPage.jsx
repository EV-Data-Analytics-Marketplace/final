import React from 'react';
import AnalyticsStatsCard from '../../components/analytics/AnalyticsStatsCard';
import DataQualityDashboard from '../../components/analytics/DataQualityDashboard';
import ReportsList from '../../components/analytics/ReportsList';
import DashboardManager from '../../components/analytics/DashboardManager';

const AdminAnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-1">View system analytics and reports</p>
      </div>
      
      <AnalyticsStatsCard />
      <DataQualityDashboard />
      <ReportsList />
      <DashboardManager />
    </div>
  );
};

export default AdminAnalyticsPage;
