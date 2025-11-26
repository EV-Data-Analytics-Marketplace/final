import { useState } from 'react';
import { useAllDatasets, useDatasetAdminManagement } from '../../hooks/data/useDataAdmin';
import { useCategories } from '../../hooks/data/useCategories';

/**
 * All Datasets Admin Component
 * Admin view to manage all datasets from all providers
 */
const AllDatasetsAdmin = () => {
  const [statusFilter, setStatusFilter] = useState(null);
  const { datasets: datasetsResponse, isLoading, error, refetch } = useAllDatasets(statusFilter);
  const { updateStatus } = useDatasetAdminManagement();
  const { categories } = useCategories(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);

  // Extract datasets array from response
  const datasets = datasetsResponse?.datasets || [];
  const total = datasetsResponse?.total || 0;

  // Debug logging
  console.log('AllDatasetsAdmin - datasetsResponse:', datasetsResponse);
  console.log('AllDatasetsAdmin - datasets array:', datasets);
  console.log('AllDatasetsAdmin - total:', total);
  console.log('AllDatasetsAdmin - isLoading:', isLoading);
  console.log('AllDatasetsAdmin - error:', error);

  const handleViewDetails = (dataset) => {
    setSelectedDataset(dataset);
    setShowModal(true);
  };

  const handleUpdateStatus = async (datasetId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }

    try {
      await updateStatus(datasetId, newStatus);
      await refetch();
      alert('Dataset status updated successfully!');
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      ARCHIVED: 'bg-yellow-100 text-yellow-800',
      SUSPENDED: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <div className="ml-4 text-lg">Loading datasets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Datasets</h3>
          <p className="text-red-600">{error.message}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Datasets</h1>
            <p className="text-sm text-gray-600 mt-1">Total: {total} dataset{total !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {datasets && datasets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Format
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {datasets.map((dataset) => (
                    <tr key={dataset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{dataset.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{dataset.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dataset.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ID: {dataset.providerId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCategoryName(dataset.categoryId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(dataset.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dataset.format}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dataset.pricingModel === 'FREE' ? 'FREE' : `$${dataset.price}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dataset.totalDownloads || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(dataset)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          View
                        </button>
                        <select
                          onChange={(e) => handleUpdateStatus(dataset.id, e.target.value)}
                          value=""
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Change Status</option>
                          {dataset.status !== 'PUBLISHED' && <option value="PUBLISHED">Publish</option>}
                          {dataset.status !== 'ARCHIVED' && <option value="ARCHIVED">Archive</option>}
                          {dataset.status !== 'SUSPENDED' && <option value="SUSPENDED">Suspend</option>}
                          {dataset.status !== 'DRAFT' && <option value="DRAFT">Draft</option>}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-4 text-lg font-medium">No datasets found</p>
              <p className="mt-2 text-sm text-gray-400">
                {statusFilter ? `No datasets with status: ${statusFilter}` : 'No datasets available in the system'}
              </p>
              <button
                onClick={refetch}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* Dataset Details Modal */}
        {showModal && selectedDataset && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>

              <div className="inline-block bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-4xl sm:w-full z-20">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Dataset Details</h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID</label>
                      <p className="mt-1 text-sm text-gray-900">#{selectedDataset.id}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Provider ID</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.providerId}</p>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Code</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.code}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1">{getStatusBadge(selectedDataset.status)}</p>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.description}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="mt-1 text-sm text-gray-900">{getCategoryName(selectedDataset.categoryId)}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data Type</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.dataType}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Format</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.format}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pricing Model</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.pricingModel}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDataset.pricingModel === 'FREE' ? 'FREE' : `${selectedDataset.price} ${selectedDataset.currency}`}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Usage Rights</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.usageRights}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {[selectedDataset.city, selectedDataset.country, selectedDataset.region].filter(Boolean).join(', ') || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">File Size</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDataset.fileSize ? `${(selectedDataset.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Record Count</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.recordCount?.toLocaleString() || 'N/A'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Downloads</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.totalDownloads || 0}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Views</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.viewCount || 0}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rating</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDataset.averageRating ? `${selectedDataset.averageRating.toFixed(1)} / 5.0` : 'No ratings'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Anonymized</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.anonymized ? 'Yes' : 'No'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">GDPR Compliant</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDataset.gdprCompliant ? 'Yes' : 'No'}</p>
                    </div>

                    {selectedDataset.tags && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Tags</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedDataset.tags}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Created At</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDataset.createdAt ? new Date(selectedDataset.createdAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Updated At</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDataset.updatedAt ? new Date(selectedDataset.updatedAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDatasetsAdmin;
