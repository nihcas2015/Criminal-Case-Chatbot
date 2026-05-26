import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseAsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: Error | null;
}

export interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: () => Promise<T>;
  reset: () => void;
}

/**
 * Custom hook for handling async operations
 */
export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  dependencies: any[] = []
): UseAsyncReturn<T> => {
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const isMountedRef = useRef(true);

  /**
   * Execute async function
   */
  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null });

    try {
      const result = await asyncFunction();

      if (isMountedRef.current) {
        setState({ status: 'success', data: result, error: null });
      }

      return result;
    } catch (error) {
      if (isMountedRef.current) {
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }

      throw error;
    }
  }, [asyncFunction]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  /**
   * Execute immediately on mount
   */
  useEffect(() => {
    if (immediate) {
      execute().catch(() => {
        // Error is handled in state
      });
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [execute, immediate, ...dependencies]);

  return { ...state, execute, reset };
};

export default useAsync;
