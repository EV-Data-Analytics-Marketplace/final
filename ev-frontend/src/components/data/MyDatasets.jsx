import { useState } from 'react';
import { useMyDatasets } from '../../hooks/data/useMyDatasets';
import { useDatasetManagement } from '../../hooks/data/useDatasetManagement';
import { useCategories } from '../../hooks/data/useCategories';

/**
 * My Datasets Component
 * Shows provider's own datasets with create/edit/delete options
 */
const MyDatasets = () => {
  const { datasets, isLoading, refetch } = useMyDatasets();
  const { create, update, publish, delete: deleteDataset } = useDatasetManagement();
  const { categories } = useCategories(true);

  const [showModal, setShowModal] = useState(false);
  const [editingDataset, setEditingDataset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    categoryId: '',
    dataType: 'RAW',
    format: 'CSV',
    pricingModel: 'FREE',
    price: 0,
    currency: 'USD',
    usageRights: 'RESEARCH_ONLY',
    region: '',
    country: '',
    city: '',
    dataStartDate: '',
    dataEndDate: '',
    fileUrl: '',
    fileSize: 0,
    recordCount: 0,
    tags: '',
    anonymized: true,
    gdprCompliant: true,
  });

  const handleCreate = () => {
    setEditingDataset(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      categoryId: categories[0]?.id || '',
      dataType: 'RAW',
      format: 'CSV',
      pricingModel: 'FREE',
      price: 0,
      currency: 'USD',
      usageRights: 'RESEARCH_ONLY',
      region: '',
      country: '',
      city: '',
      dataStartDate: '',
      dataEndDate: '',
      fileUrl: '',
      fileSize: 0,
      recordCount: 0,
      tags: '',
      anonymized: true,
      gdprCompliant: true,
    });
    setShowModal(true);
  };

  const handleEdit = (dataset) => {
    setEditingDataset(dataset);
    setFormData({
      name: dataset.name,
      code: dataset.code,
      description: dataset.description,
      categoryId: dataset.categoryId,
      dataType: dataset.dataType,
      format: dataset.format,
      pricingModel: dataset.pricingModel,
      price: dataset.price,
      currency: dataset.currency,
      usageRights: dataset.usageRights,
      region: dataset.region,
      country: dataset.country,
      city: dataset.city,
      dataStartDate: dataset.dataStartDate,
      dataEndDate: dataset.dataEndDate,
      fileUrl: dataset.fileUrl,
      fileSize: dataset.fileSize,
      recordCount: dataset.recordCount,
      tags: dataset.tags,
      anonymized: dataset.anonymized,
      gdprCompliant: dataset.gdprCompliant,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDataset) {
        await update(editingDataset.id, formData);
      } else {
        await create(formData);
      }
      await refetch();
      setShowModal(false);
      alert(`Dataset ${editingDataset ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      console.error('Failed to save dataset:', err);
      alert('Failed to save dataset');
    }
  };

  const handlePublish = async (datasetId) => {
    try {
      await publish(datasetId);
      await refetch();
      alert('Dataset published successfully!');
    } catch (err) {
      console.error('Failed to publish dataset:', err);
      alert('Failed to publish dataset');
    }
  };

  const handleDelete = async (datasetId) => {
    if (!confirm('Are you sure you want to delete this dataset?')) {
      return;
    }

    try {
      await deleteDataset(datasetId);
      await refetch();
      alert('Dataset deleted successfully!');
    } catch (err) {
      console.error('Failed to delete dataset:', err);
      alert('Failed to delete dataset');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading datasets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Datasets</h1>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
          >
            Create Dataset
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {datasets.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Code
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {datasets.map((dataset) => (
                  <tr key={dataset.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{dataset.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dataset.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          dataset.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {dataset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dataset.format}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dataset.pricingModel === 'FREE' ? 'FREE' : `$${dataset.price}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(dataset)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      {dataset.status === 'DRAFT' && (
                        <button
                          onClick={() => handlePublish(dataset.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(dataset.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No datasets yet. Create your first dataset!
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

              <div className="inline-block bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-2xl sm:w-full">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingDataset ? 'Edit Dataset' : 'Create Dataset'}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Code</label>
                        <input
                          type="text"
                          name="code"
                          required
                          value={formData.code}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          name="categoryId"
                          required
                          value={formData.categoryId}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          required
                          rows={3}
                          value={formData.description}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Format</label>
                        <select
                          name="format"
                          value={formData.format}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="CSV">CSV</option>
                          <option value="JSON">JSON</option>
                          <option value="XML">XML</option>
                          <option value="PARQUET">Parquet</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Pricing Model
                        </label>
                        <select
                          name="pricingModel"
                          value={formData.pricingModel}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="FREE">Free</option>
                          <option value="PAY_PER_DOWNLOAD">Pay Per Download</option>
                          <option value="SUBSCRIPTION">Subscription</option>
                        </select>
                      </div>

                      {formData.pricingModel !== 'FREE' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Price</label>
                          <input
                            type="number"
                            name="price"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {editingDataset ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDatasets;
