import React, { useState } from 'react';
import { useLowQualityDatasets, useAssessQuality } from '../../hooks/analytics/useDataQuality';

/**
 * DataQualityDashboard component - Monitor and assess data quality
 */
const DataQualityDashboard = () => {
  const [threshold, setThreshold] = useState(80.0);
  // Disable auto-fetch to prevent backend errors - user can click Refresh to manually fetch
  const { datasets, isLoading: loadingDatasets, error: datasetsError, refetch } = useLowQualityDatasets(threshold, false);
  const { assess, isLoading: assessing, error: assessError } = useAssessQuality();

  const [showAssessForm, setShowAssessForm] = useState(false);
  const [formData, setFormData] = useState({
    datasetId: '',
    completeness: '',
    row_count: '',
    duplicates: '',
  });

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
      const metrics = {
        completeness: parseFloat(formData.completeness),
        row_count: parseInt(formData.row_count),
        duplicates: parseInt(formData.duplicates),
        lastUpdated: new Date().toISOString(),
      };
      await assess(parseInt(formData.datasetId), metrics);
      setFormData({
        datasetId: '',
        completeness: '',
        row_count: '',
        duplicates: '',
      });
      setShowAssessForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to assess quality:', err);
    }
  };

  const getQualityBadge = (score) => {
    if (score >= 90) {
      return <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">Excellent</span>;
    } else if (score >= 80) {
      return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">Good</span>;
    } else if (score >= 60) {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">Fair</span>;
    } else {
      return <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">Poor</span>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Data Quality Dashboard</h1>

        {/* Controls */}
        <div className="bg-white shadow-md rounded-lg mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Quality Threshold:
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">%</span>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Refresh
              </button>
            </div>
            <button
              onClick={() => setShowAssessForm(!showAssessForm)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {showAssessForm ? 'Cancel' : 'Assess Quality'}
            </button>
          </div>
        </div>

        {/* Assess Quality Form */}
        {showAssessForm && (
          <div className="bg-white shadow-md rounded-lg mb-6 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Assess Data Quality</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completeness (0-1)
                  </label>
                  <input
                    type="number"
                    name="completeness"
                    value={formData.completeness}
                    onChange={handleChange}
                    placeholder="0.95"
                    step="0.01"
                    min="0"
                    max="1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Row Count
                  </label>
                  <input
                    type="number"
                    name="row_count"
                    value={formData.row_count}
                    onChange={handleChange}
                    placeholder="10000"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duplicates
                  </label>
                  <input
                    type="number"
                    name="duplicates"
                    value={formData.duplicates}
                    onChange={handleChange}
                    placeholder="50"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {assessError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{assessError.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={assessing}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {assessing ? 'Assessing...' : 'Assess Quality'}
              </button>
            </form>
          </div>
        )}

        {/* Low Quality Datasets */}
        <div className="bg-white shadow-md rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Datasets Below {threshold}% Quality
            </h2>
          </div>

          {datasetsError && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{datasetsError.message}</p>
            </div>
          )}

          {loadingDatasets && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!loadingDatasets && !datasetsError && (
            <div className="overflow-x-auto">
              {datasets.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <p className="text-lg">No low quality datasets found</p>
                  <p className="text-sm mt-2">All datasets meet the quality threshold</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dataset ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quality Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completeness
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Accuracy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Consistency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assessed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {datasets.map((dataset) => (
                      <tr key={dataset.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{dataset.datasetId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              {dataset.qualityScore?.toFixed(1)}%
                            </span>
                            {getQualityBadge(dataset.qualityScore)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {dataset.completeness?.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {dataset.accuracy?.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {dataset.consistency?.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(dataset.assessedAt)}
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

export default DataQualityDashboard;
