import { useState, useEffect } from 'react';
import analyticsService from '../../api/analyticsService';

// Hook for recording metrics
export const useRecordMetric = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recordMetric = async (metricData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.recordMetric(metricData);
      return response.data;
    } catch (err) {
      console.error('Failed to record metric:', err);
      setError(err.message || 'Failed to record metric');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const recordBatch = async (metricsList) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.recordBatchMetrics(metricsList);
      return response.data;
    } catch (err) {
      console.error('Failed to record batch metrics:', err);
      setError(err.message || 'Failed to record metrics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { recordMetric, recordBatch, loading, error };
};

// Hook for getting metrics by entity
export const useMetricsByEntity = (entityType, entityId, metricType, page = 0, size = 20) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (entityType && entityId) {
      loadMetrics();
    }
  }, [entityType, entityId, metricType, page, size]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getMetricsByEntity(
        entityType,
        entityId,
        metricType,
        page,
        size
      );
      setMetrics(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load metrics:', err);
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, totalPages, refetch: loadMetrics };
};

// Hook for getting metrics by time period
export const useMetricsByPeriod = (startDate, endDate, metricType, aggregationPeriod, page = 0, size = 50) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (startDate && endDate) {
      loadMetrics();
    }
  }, [startDate, endDate, metricType, aggregationPeriod, page, size]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getMetricsByPeriod(
        startDate,
        endDate,
        metricType,
        aggregationPeriod,
        page,
        size
      );
      setMetrics(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load metrics by period:', err);
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, totalPages, refetch: loadMetrics };
};

// Hook for getting average metric
export const useAverageMetric = (entityType, entityId, metricType, startDate, endDate) => {
  const [average, setAverage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (entityType && entityId && metricType && startDate && endDate) {
      loadAverage();
    }
  }, [entityType, entityId, metricType, startDate, endDate]);

  const loadAverage = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getAverageMetric(
        entityType,
        entityId,
        metricType,
        startDate,
        endDate
      );
      setAverage(response.data);
    } catch (err) {
      console.error('Failed to load average metric:', err);
      setError(err.message || 'Failed to load average');
    } finally {
      setLoading(false);
    }
  };

  return { average, loading, error, refetch: loadAverage };
};

// Hook for getting metrics summary
export const useMetricsSummary = (entityType, entityId) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (entityType && entityId) {
      loadSummary();
    }
  }, [entityType, entityId]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getMetricsSummary(entityType, entityId);
      setSummary(response.data);
    } catch (err) {
      console.error('Failed to load metrics summary:', err);
      setError(err.message || 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  return { summary, loading, error, refetch: loadSummary };
};

// Hook for getting metrics by type
export const useMetricsByType = (metricType, page = 0, size = 20) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (metricType) {
      loadMetrics();
    }
  }, [metricType, page, size]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getMetricsByType(metricType, page, size);
      setMetrics(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load metrics by type:', err);
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, totalPages, refetch: loadMetrics };
};
