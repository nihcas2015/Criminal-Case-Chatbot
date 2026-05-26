import { useState, useCallback, useEffect } from 'react';
import { storage } from '../utils/storage';

export interface UseLocalStorageReturn<T> {
  value: T | null;
  setValue: (value: T) => void;
  removeValue: () => void;
}

/**
 * Custom hook for local storage
 */
export const useLocalStorage = <T,>(
  key: string,
  initialValue?: T | null
): UseLocalStorageReturn<T> => {
  const [value, setValue] = useState<T | null>(() => {
    try {
      const storedValue = storage.getItem<T>(key);
      return storedValue !== null ? storedValue : (initialValue || null);
    } catch {
      return initialValue || null;
    }
  });

  /**
   * Update local storage when value changes
   */
  const handleSetValue = useCallback(
    (newValue: T) => {
      try {
        setValue(newValue);
        storage.setItem(key, newValue);

        // Notify other tabs
        window.dispatchEvent(
          new CustomEvent('localStorageChange', {
            detail: { key, value: newValue },
          })
        );
      } catch (error) {
        console.error(`Error setting localStorage item "${key}":`, error);
      }
    },
    [key]
  );

  /**
   * Remove value from local storage
   */
  const removeValue = useCallback(() => {
    try {
      setValue(null);
      storage.removeItem(key);

      // Notify other tabs
      window.dispatchEvent(
        new CustomEvent('localStorageChange', {
          detail: { key, value: null },
        })
      );
    } catch (error) {
      console.error(`Error removing localStorage item "${key}":`, error);
    }
  }, [key]);

  /**
   * Listen for storage changes from other tabs
   */
  useEffect(() => {
    const handleStorageChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.key === key) {
        setValue(customEvent.detail?.value || null);
      }
    };

    window.addEventListener('localStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, [key]);

  return {
    value,
    setValue: handleSetValue,
    removeValue,
  };
};

export default useLocalStorage;
