import React from 'react';
import ReportsList from '../../components/analytics/ReportsList';
import DataQualityDashboard from '../../components/analytics/DataQualityDashboard';

const AdminReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">System-wide reports and data quality monitoring</p>
      </div>
      
      <ReportsList />
      
      <DataQualityDashboard />
    </div>
  );
};

export default AdminReportsPage;
