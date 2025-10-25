// Custom hook for API calls with loading and error states
import { useState, useCallback } from 'react';
import { handleApiError } from '../utils/helpers';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
  };
};

// Hook for paginated API calls
export const usePaginatedApi = (apiCall, initialPageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async (pageNum = 1, size = pageSize, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pageNum,
        limit: size,
      };
      
      const response = await apiCall(params);
      const newData = response.data || [];
      const total = response.count || response.total || 0;
      
      if (reset || pageNum === 1) {
        setData(newData);
      } else {
        setData(prev => [...prev, ...newData]);
      }
      
      setTotalCount(total);
      setPage(pageNum);
      setHasMore(newData.length === size && data.length + newData.length < total);
      
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, pageSize, data.length]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchData(page + 1, pageSize, false);
    }
  }, [fetchData, loading, hasMore, page, pageSize]);

  const refresh = useCallback(() => {
    fetchData(1, pageSize, true);
  }, [fetchData, pageSize]);

  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    fetchData(1, newSize, true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    page,
    pageSize,
    totalCount,
    hasMore,
    fetchData,
    loadMore,
    refresh,
    changePageSize,
  };
};