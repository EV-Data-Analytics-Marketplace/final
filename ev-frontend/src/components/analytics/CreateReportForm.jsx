import React, { useState } from 'react';
import { useCreateReport } from '../../hooks/analytics/useCreateReport';

const CreateReportForm = ({ onSuccess }) => {
  const { create, isLoading, error } = useCreateReport();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reportType: 'BATTERY_HEALTH',
    datasetId: '',
    title: '',
    description: '',
    parameters: {},
  });

  const reportTypes = [
    'BATTERY_HEALTH',
    'ENERGY_CONSUMPTION',
    'CHARGING_PATTERNS',
    'RANGE_ANALYSIS',
    'PERFORMANCE_METRICS',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await create({
        ...formData,
        datasetId: parseInt(formData.datasetId),
      });
      setFormData({
        reportType: 'BATTERY_HEALTH',
        datasetId: '',
        title: '',
        description: '',
        parameters: {},
      });
      setShowForm(false);
      if (onSuccess) onSuccess();
      alert('Report created successfully!');
    } catch (err) {
      console.error('Failed to create report:', err);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Create New Report</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'New Report'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error.message}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type *
            </label>
            <select
              name="reportType"
              value={formData.reportType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportTypes.map(type => (
                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dataset ID *
            </label>
            <input
              type="number"
              name="datasetId"
              value={formData.datasetId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter dataset ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter report title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter report description"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Report'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateReportForm;
