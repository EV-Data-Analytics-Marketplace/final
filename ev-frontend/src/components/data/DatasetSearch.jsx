import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchDatasets } from '../../hooks/data/useSearchDatasets';
import { useCategories } from '../../hooks/data/useCategories';

/**
 * Dataset Search Component
 * Allows users to search and filter datasets
 */
const DatasetSearch = () => {
  const navigate = useNavigate();
  const { datasets, pagination, search, isLoading } = useSearchDatasets();
  const { categories } = useCategories(true); // Active categories only

  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: '',
    format: '',
    pricingModel: '',
    sortBy: 'rating',
    sortDirection: 'DESC',
    page: 0,
    size: 10,
  });

  // Initial search on component mount
  useEffect(() => {
    handleSearch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 0, // Reset to first page when filter changes
    }));
  };

  // Clean empty filter values before sending to API
  const cleanFilters = (filters) => {
    const cleaned = {};
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      // Include the value if it's not empty string, or if it's a number (including 0)
      if (value !== '' && value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  const handleSearch = async () => {
    try {
      const cleanedFilters = cleanFilters(filters);
      await search(cleanedFilters);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handlePageChange = async (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    try {
      const cleanedFilters = cleanFilters(newFilters);
      await search(cleanedFilters);
    } catch (err) {
      console.error('Page change failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Datasets</h1>

        {/* Search Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                placeholder="Search datasets..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select
                name="format"
                value={filters.format}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Formats</option>
                <option value="CSV">CSV</option>
                <option value="JSON">JSON</option>
                <option value="XML">XML</option>
                <option value="PARQUET">Parquet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Model</label>
              <select
                name="pricingModel"
                value={filters.pricingModel}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Pricing</option>
                <option value="FREE">Free</option>
                <option value="PAY_PER_DOWNLOAD">Pay Per Download</option>
                <option value="SUBSCRIPTION">Subscription</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="rating">Rating</option>
                <option value="price">Price</option>
                <option value="createdAt">Date Created</option>
                <option value="viewCount">Views</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                name="sortDirection"
                value={filters.sortDirection}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {pagination?.totalElements || 0} Results
            </h3>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Searching...</div>
          ) : datasets.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {datasets.map((dataset) => (
                <div key={dataset.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{dataset.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">{dataset.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {dataset.format}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {dataset.pricingModel}
                        </span>
                        {dataset.rating && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⭐ {dataset.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {dataset.pricingModel === 'FREE' ? 'FREE' : `$${dataset.price}`}
                      </p>
                      <button 
                        onClick={() => navigate(`/consumer/dataset/${dataset.id}`)}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">No datasets found</div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 0 || isLoading}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {pagination.page + 1} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages - 1 || isLoading}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetSearch;
