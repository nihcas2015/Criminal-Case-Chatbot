import { useState, useCallback } from 'react';
import { NOTIFICATION_TYPES } from '../utils/constants';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  removable?: boolean;
}

export interface UseNotificationReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  warning: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
}

/**
 * Custom hook for managing notifications
 */
export const useNotification = (defaultDuration = 5000): UseNotificationReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Add notification
   */
  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = `notification_${Date.now()}_${Math.random()}`;
      const newNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration || defaultDuration,
        removable: notification.removable !== false,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remove notification after duration
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    [defaultDuration]
  );

  /**
   * Remove notification
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Success notification
   */
  const success = useCallback(
    (message: string, title?: string) => {
      return addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        title: title || 'Success',
        message,
      });
    },
    [addNotification]
  );

  /**
   * Error notification
   */
  const error = useCallback(
    (message: string, title?: string) => {
      return addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        title: title || 'Error',
        message,
      });
    },
    [addNotification]
  );

  /**
   * Warning notification
   */
  const warning = useCallback(
    (message: string, title?: string) => {
      return addNotification({
        type: NOTIFICATION_TYPES.WARNING,
        title: title || 'Warning',
        message,
      });
    },
    [addNotification]
  );

  /**
   * Info notification
   */
  const info = useCallback(
    (message: string, title?: string) => {
      return addNotification({
        type: NOTIFICATION_TYPES.INFO,
        title: title || 'Info',
        message,
      });
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info,
  };
};

export default useNotification;
