import React from 'react';
import ProviderRevenue from '../../components/payment/ProviderRevenue';

const ProviderRevenuePage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your earnings and revenue statistics</p>
      </div>
      <ProviderRevenue />
    </div>
  );
};

export default ProviderRevenuePage;
