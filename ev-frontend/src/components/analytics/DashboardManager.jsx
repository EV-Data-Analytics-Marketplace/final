import React, { useState } from 'react';
import { useMyDashboards, useDashboardManagement } from '../../hooks/analytics/useDashboards';

/**
 * DashboardManager component - Manage analytics dashboards
 */
const DashboardManager = () => {
  const { dashboards, isLoading: loadingDashboards, error: dashboardsError, refetch } = useMyDashboards();
  const { create, update, remove, isLoading, error } = useDashboardManagement();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dashboardType: 'OVERVIEW',
    config: {},
    widgets: [],
    isPublic: false,
  });

  const dashboardTypes = ['OVERVIEW', 'BATTERY', 'CHARGING', 'PERFORMANCE', 'CUSTOM'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await update(editingId, formData);
        setEditingId(null);
      } else {
        await create(formData);
      }
      setFormData({
        name: '',
        description: '',
        dashboardType: 'OVERVIEW',
        config: {},
        widgets: [],
        isPublic: false,
      });
      setShowCreateForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to save dashboard:', err);
    }
  };

  const handleEdit = (dashboard) => {
    setFormData({
      name: dashboard.name,
      description: dashboard.description || '',
      dashboardType: dashboard.dashboardType,
      config: dashboard.config || {},
      widgets: dashboard.widgets || [],
      isPublic: dashboard.isPublic,
    });
    setEditingId(dashboard.id);
    setShowCreateForm(true);
  };

  const handleDelete = async (dashboardId) => {
    if (window.confirm('Are you sure you want to delete this dashboard?')) {
      try {
        await remove(dashboardId);
        refetch();
      } catch (err) {
        console.error('Failed to delete dashboard:', err);
      }
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      dashboardType: 'OVERVIEW',
      config: {},
      widgets: [],
      isPublic: false,
    });
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
        <div className="bg-white shadow-md rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">My Dashboards</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showCreateForm ? 'Cancel' : 'Create Dashboard'}
            </button>
          </div>

          {/* Create/Edit Dashboard Form */}
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {editingId ? 'Edit Dashboard' : 'Create New Dashboard'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dashboard Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="My Analytics Dashboard"
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
                    placeholder="Dashboard description"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dashboard Type
                  </label>
                  <select
                    name="dashboardType"
                    value={formData.dashboardType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {dashboardTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                    Make this dashboard public
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">{error.message}</p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : editingId ? 'Update Dashboard' : 'Create Dashboard'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Error Message */}
          {dashboardsError && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{dashboardsError.message}</p>
            </div>
          )}

          {/* Loading State */}
          {loadingDashboards && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Dashboards Grid */}
          {!loadingDashboards && !dashboardsError && (
            <div className="p-6">
              {dashboards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">No dashboards found</p>
                  <p className="text-sm mt-2">Create your first dashboard to visualize analytics</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboards.map((dashboard) => (
                    <div
                      key={dashboard.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{dashboard.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {dashboard.dashboardType}
                            </p>
                          </div>
                          {dashboard.isPublic && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Public
                            </span>
                          )}
                        </div>

                        {dashboard.description && (
                          <p className="text-sm text-gray-600 mb-4">{dashboard.description}</p>
                        )}

                        <div className="text-xs text-gray-500 mb-4">
                          Created: {formatDate(dashboard.createdAt)}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(dashboard)}
                            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(dashboard.id)}
                            disabled={isLoading}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardManager;
