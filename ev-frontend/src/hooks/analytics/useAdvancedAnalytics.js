import { useState, useEffect } from 'react';
import analyticsService from '../../api/analyticsService';

// Hook for exporting reports
export const useExportReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportPDF = async (reportId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.exportReportPDF(reportId);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      console.error('Failed to export PDF:', err);
      setError(err.message || 'Failed to export PDF');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = async (reportId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.exportReportExcel(reportId);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      console.error('Failed to export Excel:', err);
      setError(err.message || 'Failed to export Excel');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async (reportId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.exportReportCSV(reportId);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      console.error('Failed to export CSV:', err);
      setError(err.message || 'Failed to export CSV');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { exportPDF, exportExcel, exportCSV, loading, error };
};

// Hook for comparing reports
export const useCompareReports = () => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const compareReports = async (reportId1, reportId2) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.compareReports(reportId1, reportId2);
      setComparison(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to compare reports:', err);
      setError(err.message || 'Failed to compare reports');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { comparison, compareReports, loading, error };
};

// Hook for managing scheduled analysis
export const useScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getMySchedules();
      setSchedules(response.data || []);
    } catch (err) {
      console.error('Failed to load schedules:', err);
      setError(err.message || 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (scheduleData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.scheduleAnalysis(scheduleData);
      await loadSchedules(); // Refresh list
      return response.data;
    } catch (err) {
      console.error('Failed to create schedule:', err);
      setError(err.message || 'Failed to create schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (scheduleId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.updateSchedule(scheduleId, updateData);
      await loadSchedules(); // Refresh list
      return response.data;
    } catch (err) {
      console.error('Failed to update schedule:', err);
      setError(err.message || 'Failed to update schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleSchedule = async (scheduleId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.toggleSchedule(scheduleId);
      await loadSchedules(); // Refresh list
      return response.data;
    } catch (err) {
      console.error('Failed to toggle schedule:', err);
      setError(err.message || 'Failed to toggle schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (scheduleId) => {
    try {
      setLoading(true);
      setError(null);
      await analyticsService.deleteSchedule(scheduleId);
      await loadSchedules(); // Refresh list
    } catch (err) {
      console.error('Failed to delete schedule:', err);
      setError(err.message || 'Failed to delete schedule');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  return {
    schedules,
    createSchedule,
    updateSchedule,
    toggleSchedule,
    deleteSchedule,
    refetch: loadSchedules,
    loading,
    error,
  };
};

// Hook for trending insights
export const useTrendingInsights = (days = 7, page = 0, size = 10) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadTrending();
  }, [days, page, size]);

  const loadTrending = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getTrendingInsights(days, page, size);
      setInsights(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load trending insights:', err);
      setError(err.message || 'Failed to load trending insights');
    } finally {
      setLoading(false);
    }
  };

  return { insights, loading, error, totalPages, refetch: loadTrending };
};

// Hook for performance benchmarks
export const usePerformanceBenchmarks = (metricType) => {
  const [benchmarks, setBenchmarks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (metricType) {
      loadBenchmarks();
    }
  }, [metricType]);

  const loadBenchmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getPerformanceBenchmarks(metricType);
      setBenchmarks(response.data);
    } catch (err) {
      console.error('Failed to load benchmarks:', err);
      setError(err.message || 'Failed to load benchmarks');
    } finally {
      setLoading(false);
    }
  };

  return { benchmarks, loading, error, refetch: loadBenchmarks };
};
