import React from 'react';
import MyDatasets from '../../components/data/MyDatasets';

const ProviderDatasetsPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Datasets</h1>
        <p className="text-gray-600 mt-1">Upload, manage, and publish your datasets</p>
      </div>
      <MyDatasets />
    </div>
  );
};

export default ProviderDatasetsPage;
