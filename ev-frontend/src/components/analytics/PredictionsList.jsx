import React, { useState } from 'react';
import { usePredictions, useCreatePrediction } from '../../hooks/analytics/usePredictions';

/**
 * PredictionsList component - Manage AI predictions
 */
const PredictionsList = () => {
  const { predictions, isLoading: loadingPredictions, error: predictionsError, refetch } = usePredictions();
  const { create, isLoading: creating, error: createError } = useCreatePrediction();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    predictionType: 'BATTERY_DEGRADATION',
    datasetId: '',
    inputData: {},
    modelVersion: 'v1.0',
  });

  const predictionTypes = [
    'BATTERY_DEGRADATION',
    'RANGE_ESTIMATION',
    'CHARGING_TIME',
    'ENERGY_CONSUMPTION',
    'MAINTENANCE_PREDICTION',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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
        predictionType: 'BATTERY_DEGRADATION',
        datasetId: '',
        inputData: {},
        modelVersion: 'v1.0',
      });
      setShowCreateForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to create prediction:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 0.8) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">High</span>;
    } else if (confidence >= 0.6) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Medium</span>;
    } else {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Low</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">AI Predictions</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showCreateForm ? 'Cancel' : 'New Prediction'}
            </button>
          </div>

          {/* Create Prediction Form */}
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Prediction</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prediction Type
                    </label>
                    <select
                      name="predictionType"
                      value={formData.predictionType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {predictionTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dataset ID
                    </label>
                    <input
                      type="number"
                      name="datasetId"
                      value={formData.datasetId}
                      onChange={handleChange}
                      placeholder="Enter dataset ID"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model Version
                  </label>
                  <input
                    type="text"
                    name="modelVersion"
                    value={formData.modelVersion}
                    onChange={handleChange}
                    placeholder="v1.0"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {createError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">{createError.message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Prediction'}
                </button>
              </form>
            </div>
          )}

          {/* Error Message */}
          {predictionsError && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{predictionsError.message}</p>
            </div>
          )}

          {/* Loading State */}
          {loadingPredictions && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Predictions List */}
          {!loadingPredictions && !predictionsError && (
            <div className="overflow-x-auto">
              {predictions.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <p className="text-lg">No predictions found</p>
                  <p className="text-sm mt-2">Create your first AI prediction</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dataset
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {predictions.map((prediction) => (
                      <tr key={prediction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{prediction.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {prediction.predictionType?.replace(/_/g, ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          #{prediction.datasetId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(prediction.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {prediction.confidence ? getConfidenceBadge(prediction.confidence) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(prediction.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionsList;
