import React from 'react';
import DatasetSearch from '../../components/data/DatasetSearch';

const ConsumerBrowsePage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Datasets</h1>
        <p className="text-gray-600 mt-1">Discover and purchase datasets for your research</p>
      </div>
      <DatasetSearch />
    </div>
  );
};

export default ConsumerBrowsePage;
