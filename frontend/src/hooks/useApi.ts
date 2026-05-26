import { useState, useCallback, useEffect } from 'react';
import { apiClient, ApiResponse } from '../utils/apiClient';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  execute: () => Promise<void>;
  reset: () => void;
  setData: (data: T) => void;
}

/**
 * Custom hook for API calls
 */
export const useApi = <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  immediate = true,
  dependencies: any[] = []
): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Execute API call
   */
  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      let response: ApiResponse<T>;

      switch (method) {
        case 'POST':
          response = await apiClient.post<T>(endpoint, body);
          break;
        case 'PUT':
          response = await apiClient.put<T>(endpoint, body);
          break;
        case 'DELETE':
          response = await apiClient.delete<T>(endpoint);
          break;
        case 'GET':
        default:
          response = await apiClient.get<T>(endpoint);
          break;
      }

      if (response.error) {
        setState({ data: null, loading: false, error: response.message || response.error });
      } else {
        setState({ data: response.data || null, loading: false, error: null });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [endpoint, method, body]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  /**
   * Set data directly
   */
  const setData = useCallback((data: T) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  /**
   * Execute on mount if immediate is true
   */
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute, ...dependencies]);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
};

export default useApi;
