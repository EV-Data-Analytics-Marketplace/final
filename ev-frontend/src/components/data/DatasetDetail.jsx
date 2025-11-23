import { useDataset } from '../../hooks/data/useDataset';
import { useDatasetRatings, useRatingManagement } from '../../hooks/data/useRatings';
import { useAccessManagement, useMyAccesses } from '../../hooks/data/useAccess';
import { useCreateTransaction } from '../../hooks/payment/useCreateTransaction';
import { usePaymentMethods } from '../../hooks/payment/usePaymentMethods';
import { useState, useEffect } from 'react';
import React from 'react';

/**
 * Dataset Detail Component
 * Shows complete dataset information with purchase/access options
 */
const DatasetDetail = ({ datasetId }) => {
  const { dataset, isLoading } = useDataset(datasetId);
  const { ratings, refetch: refetchRatings } = useDatasetRatings(datasetId);
  const { grant, download, isLoading: accessLoading } = useAccessManagement();
  const { create: createRating, isLoading: ratingLoading } = useRatingManagement();
  const { create: createTransaction, isLoading: transactionLoading } = useCreateTransaction();
  const { paymentMethods, refetch: refetchPaymentMethods } = usePaymentMethods();
  const { accesses, refetch: refetchAccesses } = useMyAccesses();
  
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [accessType, setAccessType] = useState('DOWNLOAD');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingFormData, setRatingFormData] = useState({
    rating: 5,
    comment: '',
  });

  // Check if user already has access to this dataset (recalculate when accesses change)
  const hasActiveAccess = React.useMemo(() => {
    return accesses && accesses.length > 0 && accesses.some(
      access => access.datasetId === parseInt(datasetId) && access.status === 'ACTIVE'
    );
  }, [accesses, datasetId]);

  // Auto-refresh accesses when component mounts or datasetId changes
  useEffect(() => {
    refetchAccesses();
  }, [datasetId]);

  // Load payment methods and set default when modal opens
  useEffect(() => {
    if (showPurchaseModal && paymentMethods && paymentMethods.length > 0) {
      const defaultMethod = paymentMethods.find(pm => pm.isDefault) || paymentMethods[0];
      setSelectedPaymentMethod(defaultMethod?.id);
    }
  }, [showPurchaseModal, paymentMethods]);

  const handlePurchase = async () => {
    try {
      if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return;
      }

      // Refresh accesses to get the latest data and check for existing access
      console.log('Refreshing accesses before purchase...');
      const latestAccesses = await refetchAccesses();
      console.log('Latest accesses:', latestAccesses);
      console.log('Current datasetId:', datasetId, 'Type:', typeof datasetId);
      
      const alreadyHasAccess = latestAccesses && latestAccesses.some(
        access => {
          console.log('Checking access:', access.datasetId, 'Type:', typeof access.datasetId, 'Status:', access.status);
          return access.datasetId === parseInt(datasetId) && access.status === 'ACTIVE';
        }
      );
      
      console.log('Already has access?', alreadyHasAccess);
      
      if (alreadyHasAccess) {
        alert('You already have active access to this dataset');
        setShowPurchaseModal(false);
        return;
      }

      // First, create the transaction
      const transactionData = {
        datasetId: dataset.id,
        transactionType: 'PURCHASE',
        amount: dataset.price || 0,
        paymentMethod: 'CREDIT_CARD',
        paymentMethodId: selectedPaymentMethod,
      };

      // Add optional fields based on access type
      if (accessType === 'API') {
        transactionData.subscriptionDays = 30;
        transactionData.apiCallsLimit = 10000;
      }
      
      await createTransaction(transactionData);
      
      // Refresh accesses - transaction might auto-grant access on backend
      console.log('Transaction created, refreshing accesses...');
      await refetchAccesses();
      
      // Check if access was auto-granted by transaction
      const updatedAccesses = await refetchAccesses();
      const accessGranted = updatedAccesses && updatedAccesses.some(
        access => access.datasetId === parseInt(datasetId) && access.status === 'ACTIVE'
      );
      
      console.log('Access auto-granted?', accessGranted);
      
      // Only manually grant access if transaction didn't auto-grant it
      if (!accessGranted) {
        console.log('Manually granting access...');
        const grantData = {
          datasetId: dataset.id,
          accessType,
          durationDays: accessType === 'API' ? 30 : null,
          apiCallsLimit: accessType === 'API' ? 10000 : 0,
        };

        await grant(grantData);
      } else {
        console.log('Access was auto-granted by transaction, skipping manual grant');
      }
      
      // Final refresh to ensure UI is up to date
      await refetchAccesses();
      
      setShowPurchaseModal(false);
      alert('Purchase completed successfully!');
    } catch (err) {
      console.error('Purchase failed:', err);
      console.error('Error response status:', err.response?.status);
      console.error('Error response data:', JSON.stringify(err.response?.data, null, 2));
      console.error('Grant data sent:', JSON.stringify({
        datasetId: dataset.id,
        accessType,
        durationDays: accessType === 'API' ? 30 : null,
        apiCallsLimit: accessType === 'API' ? 10000 : 0,
      }, null, 2));
      
      // Show user-friendly error message
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      alert('Failed to complete purchase: ' + errorMsg);
    }
  };

  const handleDownload = async () => {
    try {
      await download(dataset.id);
      alert('Download recorded successfully!');
      // Implement actual file download logic here
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download dataset');
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      await createRating({
        datasetId: dataset.id,
        rating: parseInt(ratingFormData.rating),
        comment: ratingFormData.comment.trim() || null,
      });
      setShowRatingForm(false);
      setRatingFormData({ rating: 5, comment: '' });
      refetchRatings();
      alert('Rating submitted successfully!');
    } catch (err) {
      console.error('Failed to submit rating:', err);
      alert('Failed to submit rating');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dataset...</div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">Dataset not found</div>
      </div>
    );
  }

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{dataset.name}</h1>
                <p className="mt-2 text-sm text-gray-500">Code: {dataset.code}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {dataset.format}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {dataset.dataType}
                  </span>
                  {averageRating > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      ⭐ {averageRating.toFixed(1)} ({ratings.length} reviews)
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">
                  {dataset.pricingModel === 'FREE' ? 'FREE' : `$${dataset.price}`}
                </p>
                <p className="text-sm text-gray-500">{dataset.pricingModel}</p>
                
                {hasActiveAccess ? (
                  <div className="mt-4">
                    <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-md">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      You have access
                    </div>
                    <button
                      onClick={handleDownload}
                      className="mt-2 w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
                    >
                      Download Dataset
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="mt-4 px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
                  >
                    Get Access
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-gray-600">{dataset.description}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="border-t border-gray-200 px-6 py-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Region</dt>
                <dd className="mt-1 text-sm text-gray-900">{dataset.region}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="mt-1 text-sm text-gray-900">{dataset.country}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900">{dataset.city}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">File Size</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {(dataset.fileSize / (1024 * 1024)).toFixed(2)} MB
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Record Count</dt>
                <dd className="mt-1 text-sm text-gray-900">{dataset.recordCount?.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Usage Rights</dt>
                <dd className="mt-1 text-sm text-gray-900">{dataset.usageRights}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Data Period</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(dataset.dataStartDate).toLocaleDateString()} - {new Date(dataset.dataEndDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Views</dt>
                <dd className="mt-1 text-sm text-gray-900">{dataset.viewCount || 0}</dd>
              </div>
            </dl>

            {dataset.tags && (
              <div className="mt-6">
                <dt className="text-sm font-medium text-gray-500 mb-2">Tags</dt>
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sample Data */}
          {dataset.sampleData && (
            <div className="border-t border-gray-200 px-6 py-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Sample Data</h3>
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs">
                {dataset.sampleData}
              </pre>
            </div>
          )}

          {/* Reviews */}
          <div className="border-t border-gray-200 px-6 py-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reviews ({ratings.length})</h3>
              <button
                onClick={() => setShowRatingForm(!showRatingForm)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
              >
                {showRatingForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Rating Form */}
            {showRatingForm && (
              <form onSubmit={handleSubmitRating} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingFormData({ ...ratingFormData, rating: star })}
                        className="text-2xl focus:outline-none"
                      >
                        {star <= ratingFormData.rating ? '⭐' : '☆'}
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({ratingFormData.rating}/5)</span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    value={ratingFormData.comment}
                    onChange={(e) => setRatingFormData({ ...ratingFormData, comment: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Share your experience with this dataset..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={ratingLoading}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {ratingLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.slice(0, 5).map((rating) => (
                  <div key={rating.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-400">{'⭐'.repeat(rating.rating)}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="mt-2 text-sm text-gray-600">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Purchase Modal */}
        {showPurchaseModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Get Access to {dataset.name}
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Type
                    </label>
                    <select
                      value={accessType}
                      onChange={(e) => setAccessType(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="DOWNLOAD">Download</option>
                      <option value="API">API Access (30 days, 10k calls)</option>
                    </select>
                  </div>

                  {/* Payment Method Selection */}
                  {paymentMethods && paymentMethods.length > 0 ? (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={selectedPaymentMethod || ''}
                        onChange={(e) => setSelectedPaymentMethod(parseInt(e.target.value))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {paymentMethods.map((pm) => (
                          <option key={pm.id} value={pm.id}>
                            {pm.type} - {pm.cardNumber ? `****${pm.cardNumber.slice(-4)}` : 'Default'}
                            {pm.isDefault ? ' (Default)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        No payment method found. Please add a payment method first.
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Price: {dataset.pricingModel === 'FREE' ? 'FREE' : `$${dataset.price}`}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={handlePurchase}
                    disabled={accessLoading || transactionLoading || (!paymentMethods || paymentMethods.length === 0)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {(accessLoading || transactionLoading) ? 'Processing...' : 'Confirm Purchase'}
                  </button>
                  <button
                    onClick={() => setShowPurchaseModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
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

export default DatasetDetail;
