import React, { useState } from 'react';
import { useAssessDataQuality } from '../../hooks/analytics/useDataQuality';

const AssessDataQualityForm = ({ datasetId, onSuccess }) => {
  const { assess, isLoading, error } = useAssessDataQuality();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    datasetId: datasetId || '',
    completenessScore: '',
    accuracyScore: '',
    consistencyScore: '',
    timelinessScore: '',
    validityScore: '',
    issuesFound: [],
    recommendations: [],
  });

  const [newIssue, setNewIssue] = useState('');
  const [newRecommendation, setNewRecommendation] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addIssue = () => {
    if (newIssue.trim()) {
      setFormData(prev => ({
        ...prev,
        issuesFound: [...prev.issuesFound, newIssue.trim()],
      }));
      setNewIssue('');
    }
  };

  const removeIssue = (index) => {
    setFormData(prev => ({
      ...prev,
      issuesFound: prev.issuesFound.filter((_, i) => i !== index),
    }));
  };

  const addRecommendation = () => {
    if (newRecommendation.trim()) {
      setFormData(prev => ({
        ...prev,
        recommendations: [...prev.recommendations, newRecommendation.trim()],
      }));
      setNewRecommendation('');
    }
  };

  const removeRecommendation = (index) => {
    setFormData(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const assessmentData = {
        datasetId: parseInt(formData.datasetId),
        completenessScore: parseFloat(formData.completenessScore),
        accuracyScore: parseFloat(formData.accuracyScore),
        consistencyScore: parseFloat(formData.consistencyScore),
        timelinessScore: parseFloat(formData.timelinessScore),
        validityScore: parseFloat(formData.validityScore),
        issuesFound: formData.issuesFound,
        recommendations: formData.recommendations,
      };

      await assess(assessmentData);
      
      setFormData({
        datasetId: datasetId || '',
        completenessScore: '',
        accuracyScore: '',
        consistencyScore: '',
        timelinessScore: '',
        validityScore: '',
        issuesFound: [],
        recommendations: [],
      });
      setShowForm(false);
      if (onSuccess) onSuccess();
      alert('Data quality assessment submitted successfully!');
    } catch (err) {
      console.error('Failed to assess data quality:', err);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Assess Data Quality</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          {showForm ? 'Cancel' : 'New Assessment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error.message}</p>
            </div>
          )}

          {!datasetId && (
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter dataset ID"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completeness Score * (0-100)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="completenessScore"
                value={formData.completenessScore}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 95.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accuracy Score * (0-100)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="accuracyScore"
                value={formData.accuracyScore}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 98.2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consistency Score * (0-100)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="consistencyScore"
                value={formData.consistencyScore}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 92.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeliness Score * (0-100)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="timelinessScore"
                value={formData.timelinessScore}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 88.5"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Validity Score * (0-100)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="validityScore"
                value={formData.validityScore}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 96.7"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issues Found
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIssue())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Add an issue..."
              />
              <button
                type="button"
                onClick={addIssue}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {formData.issuesFound.map((issue, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <span className="text-sm text-gray-700">{issue}</span>
                  <button
                    type="button"
                    onClick={() => removeIssue(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommendations
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newRecommendation}
                onChange={(e) => setNewRecommendation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRecommendation())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Add a recommendation..."
              />
              <button
                type="button"
                onClick={addRecommendation}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {formData.recommendations.map((rec, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <span className="text-sm text-gray-700">{rec}</span>
                  <button
                    type="button"
                    onClick={() => removeRecommendation(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AssessDataQualityForm;
