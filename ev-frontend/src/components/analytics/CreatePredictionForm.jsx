import React, { useState } from 'react';
import { useCreatePrediction } from '../../hooks/analytics/usePredictions';

const CreatePredictionForm = ({ onSuccess }) => {
  const { create, isLoading, error } = useCreatePrediction();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    predictionType: 'BATTERY_DEGRADATION',
    datasetId: '',
    modelVersion: 'v1.0',
    inputData: {
      currentSOH: '',
      avgTemp: '',
      chargeCycles: '',
      avgChargeRate: '',
    },
  });

  const predictionTypes = [
    'BATTERY_DEGRADATION',
    'RANGE_PREDICTION',
    'MAINTENANCE_SCHEDULE',
    'FAILURE_PREDICTION',
    'ENERGY_FORECAST',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputDataChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      inputData: {
        ...prev.inputData,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert input data to numbers
      const processedInputData = {};
      Object.keys(formData.inputData).forEach(key => {
        const val = formData.inputData[key];
        if (val !== '') {
          processedInputData[key] = parseFloat(val);
        }
      });

      await create({
        predictionType: formData.predictionType,
        datasetId: parseInt(formData.datasetId),
        modelVersion: formData.modelVersion,
        inputData: processedInputData,
      });

      setFormData({
        predictionType: 'BATTERY_DEGRADATION',
        datasetId: '',
        modelVersion: 'v1.0',
        inputData: {
          currentSOH: '',
          avgTemp: '',
          chargeCycles: '',
          avgChargeRate: '',
        },
      });
      setShowForm(false);
      if (onSuccess) onSuccess();
      alert('Prediction created successfully!');
    } catch (err) {
      console.error('Failed to create prediction:', err);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Create New Prediction</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          {showForm ? 'Cancel' : 'New Prediction'}
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
              Prediction Type *
            </label>
            <select
              name="predictionType"
              value={formData.predictionType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {predictionTypes.map(type => (
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter dataset ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Version
            </label>
            <input
              type="text"
              name="modelVersion"
              value={formData.modelVersion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., v1.0"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Input Data (for Battery Degradation)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Current SOH (%)</label>
                <input
                  type="number"
                  step="0.01"
                  name="currentSOH"
                  value={formData.inputData.currentSOH}
                  onChange={handleInputDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 95.5"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Avg Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  name="avgTemp"
                  value={formData.inputData.avgTemp}
                  onChange={handleInputDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 28.0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Charge Cycles</label>
                <input
                  type="number"
                  name="chargeCycles"
                  value={formData.inputData.chargeCycles}
                  onChange={handleInputDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 150"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Avg Charge Rate (C)</label>
                <input
                  type="number"
                  step="0.1"
                  name="avgChargeRate"
                  value={formData.inputData.avgChargeRate}
                  onChange={handleInputDataChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 1.5"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Prediction'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreatePredictionForm;
