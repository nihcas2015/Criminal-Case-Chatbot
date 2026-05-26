import React from 'react';
import '../styles/Notification.css';
import { Notification } from '../hooks/useNotification.ts';

interface NotificationContainerProps {
  notifications: Notification[];
  onRemoveNotification: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemoveNotification,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '💬';
    }
  };

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <span className="notification-icon">{getIcon(notification.type)}</span>
          <div className="notification-content">
            {notification.title && (
              <div className="notification-title">{notification.title}</div>
            )}
            <div className="notification-message">{notification.message}</div>
          </div>
          {notification.removable && (
            <button
              className="notification-close"
              onClick={() => onRemoveNotification(notification.id)}
              aria-label="Close notification"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
