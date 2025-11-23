import React, { useState } from 'react';
import { usePaymentMethods, usePaymentMethodManagement } from '../../hooks/payment/usePaymentMethods';

/**
 * PaymentMethodForm component - Manage payment methods
 */
const PaymentMethodForm = () => {
  const { paymentMethods, isLoading: loadingMethods, error: methodsError, refetch } = usePaymentMethods();
  const { add, setDefault, delete: deleteMethod, isLoading, error } = usePaymentMethodManagement();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'CREDIT_CARD',
    cardNumber: '',
    cardHolderName: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCvv: '',
    isDefault: false,
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
      console.log('Submitting payment method:', formData);
      await add(formData);
      setFormData({
        type: 'CREDIT_CARD',
        cardNumber: '',
        cardHolderName: '',
        cardExpMonth: '',
        cardExpYear: '',
        cardCvv: '',
        isDefault: false,
      });
      setShowAddForm(false);
      refetch();
      alert('Payment method added successfully!');
    } catch (err) {
      console.error('Failed to add payment method:', err);
      console.error('Error response:', JSON.stringify(err.response?.data, null, 2));
      console.error('Error status:', err.response?.status);
      
      const errorMsg = err.response?.data?.errors 
        ? Object.entries(err.response.data.errors).map(([field, msg]) => `${field}: ${msg}`).join(', ')
        : err.response?.data?.message || err.message;
      
      alert('Failed to add payment method: ' + errorMsg);
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      await setDefault(methodId);
      refetch();
    } catch (err) {
      console.error('Failed to set default payment method:', err);
    }
  };

  const handleDelete = async (methodId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await deleteMethod(methodId);
        refetch();
      } catch (err) {
        console.error('Failed to delete payment method:', err);
      }
    }
  };

  const formatCardNumber = (cardNumber) => {
    if (!cardNumber || typeof cardNumber !== 'string') {
      return '**** **** **** ****';
    }
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Payment Methods</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showAddForm ? 'Cancel' : 'Add New Card'}
            </button>
          </div>

          {/* Add Payment Method Form */}
          {showAddForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Payment Method</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="16"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    name="cardHolderName"
                    value={formData.cardHolderName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Month
                    </label>
                    <input
                      type="text"
                      name="cardExpMonth"
                      value={formData.cardExpMonth}
                      onChange={handleChange}
                      placeholder="MM"
                      maxLength="2"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Year
                    </label>
                    <input
                      type="text"
                      name="cardExpYear"
                      value={formData.cardExpYear}
                      onChange={handleChange}
                      placeholder="YYYY"
                      maxLength="4"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="3"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Set as default payment method</span>
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">{error.message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Payment Method'}
                </button>
              </form>
            </div>
          )}

          {/* Error Message */}
          {methodsError && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{methodsError.message}</p>
            </div>
          )}

          {/* Loading State */}
          {loadingMethods && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Payment Methods List */}
          {!loadingMethods && !methodsError && (
            <div className="px-6 py-4">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No payment methods added yet</p>
                  <p className="text-sm mt-2">Add a payment method to make purchases</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg ${
                        method.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gray-200 rounded-md p-3">
                            <svg
                              className="w-8 h-8 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatCardNumber(method.cardNumber)}
                            </p>
                            <p className="text-sm text-gray-500">{method.cardHolderName}</p>
                            <p className="text-sm text-gray-500">
                              Expires: {method.expiryMonth}/{method.expiryYear}
                            </p>
                            {method.isDefault && (
                              <span className="inline-block mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!method.isDefault && (
                            <button
                              onClick={() => handleSetDefault(method.id)}
                              disabled={isLoading}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(method.id)}
                            disabled={isLoading}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
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

export default PaymentMethodForm;
