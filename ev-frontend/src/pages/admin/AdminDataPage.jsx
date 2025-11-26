import React, { useState } from 'react';
import AllDatasetsAdmin from '../../components/data/AllDatasetsAdmin';
import CategoriesAdmin from '../../components/data/CategoriesAdmin';

const AdminDataPage = () => {
  const [activeTab, setActiveTab] = useState('datasets');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage datasets and categories</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('datasets')}
            className={`${
              activeTab === 'datasets'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Datasets
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`${
              activeTab === 'categories'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Categories
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'datasets' && <AllDatasetsAdmin />}
      {activeTab === 'categories' && <CategoriesAdmin />}
    </div>
  );
};

export default AdminDataPage;
