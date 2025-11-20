import React from 'react';
import MyDatasets from '../../components/data/MyDatasets';

const AdminDataPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage all datasets in the platform</p>
      </div>
      <MyDatasets />
    </div>
  );
};

export default AdminDataPage;
