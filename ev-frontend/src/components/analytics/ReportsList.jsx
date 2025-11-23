import React, { useState } from 'react';
import { useReports, useReportManagement, useReport } from '../../hooks/analytics/useReports';
import useCreateReport from '../../hooks/analytics/useCreateReport';

/**
 * ReportsList component - Display and manage analysis reports
 */
const ReportsList = () => {
  const { reports, isLoading: loadingReports, error: reportsError, refetch } = useReports();
  const { deleteReportById, isLoading: deleting } = useReportManagement();
  const { create, isLoading: creating, error: createError } = useCreateReport();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const { report: selectedReport, isLoading: loadingDetail } = useReport(selectedReportId);
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
    'CHARGING_BEHAVIOR',
    'RANGE_ANALYSIS',
    'PERFORMANCE_METRICS',
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
        reportType: 'BATTERY_HEALTH',
        datasetId: '',
        title: '',
        description: '',
        parameters: {},
      });
      setShowCreateForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to create report:', err);
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReportById(reportId);
        refetch();
      } catch (err) {
        console.error('Failed to delete report:', err);
      }
    }
  };

  const handleViewDetail = (reportId) => {
    setSelectedReportId(reportId);
  };

  const handleCloseDetail = () => {
    setSelectedReportId(null);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Analysis Reports</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showCreateForm ? 'Cancel' : 'Create Report'}
            </button>
          </div>

          {/* Create Report Form */}
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Report</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Report Type
                    </label>
                    <select
                      name="reportType"
                      value={formData.reportType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {reportTypes.map((type) => (
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
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Report title"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Report description"
                    rows="3"
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
                  {creating ? 'Creating...' : 'Create Report'}
                </button>
              </form>
            </div>
          )}

          {/* Error Message */}
          {reportsError && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{reportsError.message}</p>
            </div>
          )}

          {/* Loading State */}
          {loadingReports && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Reports List */}
          {!loadingReports && !reportsError && (
            <div className="overflow-x-auto">
              {reports.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <p className="text-lg">No reports found</p>
                  <p className="text-sm mt-2">Create your first analysis report</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dataset ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{report.title}</div>
                          {report.description && (
                            <div className="text-sm text-gray-500">{report.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {report.reportType?.replace(/_/g, ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          #{report.datasetId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(report.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                          <button
                            onClick={() => handleViewDetail(report.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDelete(report.id)}
                            disabled={deleting}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Report Detail Modal */}
        {selectedReportId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Report Details</h3>
                <button
                  onClick={handleCloseDetail}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="px-6 py-4">
                {loadingDetail ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : selectedReport ? (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-3">Basic Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Report ID</p>
                          <p className="font-medium">#{selectedReport.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Report Type</p>
                          <p className="font-medium">{selectedReport.reportType?.replace(/_/g, ' ')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Dataset ID</p>
                          <p className="font-medium">#{selectedReport.datasetId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Title</h4>
                      <p className="text-gray-800">{selectedReport.title}</p>
                    </div>

                    {selectedReport.description && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                        <p className="text-gray-700">{selectedReport.description}</p>
                      </div>
                    )}

                    {/* Report Data/Results */}
                    {selectedReport.reportData && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Report Data</h4>
                        <div className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                          <pre className="text-sm">
                            {JSON.stringify(selectedReport.reportData, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Parameters */}
                    {selectedReport.parameters && Object.keys(selectedReport.parameters).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Parameters</h4>
                        <div className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                          <pre className="text-sm">
                            {JSON.stringify(selectedReport.parameters, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-3">Timestamps</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Created At</p>
                          <p className="font-medium">{formatDate(selectedReport.createdAt)}</p>
                        </div>
                        {selectedReport.updatedAt && (
                          <div>
                            <p className="text-sm text-gray-600">Updated At</p>
                            <p className="font-medium">{formatDate(selectedReport.updatedAt)}</p>
                          </div>
                        )}
                        {selectedReport.completedAt && (
                          <div>
                            <p className="text-sm text-gray-600">Completed At</p>
                            <p className="font-medium">{formatDate(selectedReport.completedAt)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Report not found
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
                <button
                  onClick={handleCloseDetail}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsList;
