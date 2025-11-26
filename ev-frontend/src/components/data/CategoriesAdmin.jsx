import { useState } from 'react';
import { useCategories } from '../../hooks/data/useCategories';
import { createCategory, updateCategory, deleteCategory } from '../../api/dataService';

/**
 * Categories Admin Component
 * Admin view to manage dataset categories
 */
const CategoriesAdmin = () => {
  const { categories, isLoading, refetch } = useCategories(false); // Get all categories including inactive
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    iconUrl: '',
    type: 'VEHICLE_DATA',
    active: true,
    displayOrder: 0,
  });

  const categoryTypes = [
    'VEHICLE_DATA',
    'CHARGING_DATA',
    'BATTERY_DATA',
    'DRIVING_BEHAVIOR',
    'ENERGY_CONSUMPTION',
    'VEHICLE_DIAGNOSTICS',
    'OTHER',
  ];

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      iconUrl: '',
      type: 'VEHICLE_DATA',
      active: true,
      displayOrder: categories.length,
    });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      code: category.code,
      description: category.description,
      iconUrl: category.iconUrl || '',
      type: category.type,
      active: category.active,
      displayOrder: category.displayOrder,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        alert('Category updated successfully!');
      } else {
        await createCategory(formData);
        alert('Category created successfully!');
      }
      await refetch();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save category:', err);
      alert('Failed to save category: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      await refetch();
      alert('Category deleted successfully!');
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category: ' + (err.response?.data?.message || err.message));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <div className="ml-4 text-lg">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
            <p className="text-sm text-gray-600 mt-1">Total: {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Category
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {categories && categories.length > 0 ? (
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
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Display Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{category.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {category.iconUrl && (
                              <img src={category.iconUrl} alt="" className="h-8 w-8 mr-2 object-contain" />
                            )}
                            <span className="text-sm font-medium text-gray-900">{category.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">{category.code}</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {category.displayOrder}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              category.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {category.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg font-medium">No categories found</p>
              <p className="mt-2 text-sm text-gray-400">Create your first category</p>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>

              <div className="inline-block bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-2xl sm:w-full z-20">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingCategory ? 'Edit Category' : 'Create Category'}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Battery Health Data"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Code *</label>
                        <input
                          type="text"
                          name="code"
                          required
                          value={formData.code}
                          onChange={handleChange}
                          placeholder="e.g., BATTERY_HEALTH"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        />
                        <p className="mt-1 text-xs text-gray-500">Use uppercase with underscores (e.g., BATTERY_HEALTH)</p>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description *</label>
                        <textarea
                          name="description"
                          required
                          rows={3}
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Brief description of this category..."
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type *</label>
                        <select
                          name="type"
                          required
                          value={formData.type}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {categoryTypes.map((type) => (
                            <option key={type} value={type}>
                              {type.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Display Order</label>
                        <input
                          type="number"
                          name="displayOrder"
                          value={formData.displayOrder}
                          onChange={handleChange}
                          min="0"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Icon URL</label>
                        <input
                          type="text"
                          name="iconUrl"
                          value={formData.iconUrl}
                          onChange={handleChange}
                          placeholder="https://example.com/icon.png"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                        <p className="mt-1 text-xs text-gray-500">Only active categories will be shown to users</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {editingCategory ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default CategoriesAdmin;
