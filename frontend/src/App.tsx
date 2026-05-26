import React, { useEffect, useState } from 'react';
import './styles/App.css';
import ChatInterface from './components/features/ChatInterface.tsx';
import Sidebar from './components/features/Sidebar.tsx';
import AnalyticsPanel from './components/features/AnalyticsPanel.tsx';
import NotificationContainer from './components/NotificationContainer.tsx';
import { useNotification } from './hooks/index.ts';
import { apiClient } from './utils/apiClient.ts';

const App: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  const [isServerHealthy, setIsServerHealthy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check server health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await apiClient.checkHealth();
        setIsServerHealthy(isHealthy);
      } catch (error) {
        setIsServerHealthy(false);
        console.error('Failed to check server health:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();

    // Check health every 30 seconds
    const healthCheckInterval = setInterval(checkHealth, 30000);

    return () => clearInterval(healthCheckInterval);
  }, []);

  if (isLoading) {
    return (
      <div className="app-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">
              <span className="title-icon">⚖️</span>
              Legal AI Assistant
            </h1>
            <p className="app-subtitle">Intelligent document analysis and legal insights</p>
          </div>
          <div className="header-right">
            <button className="status-button">
              <span className={`status-dot ${isServerHealthy ? 'status-connected' : 'status-disconnected'}`}></span>
              {isServerHealthy ? 'Connected' : 'Offline'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="app-main">
        <div className="main-content">
          {/* Sidebar */}
          <Sidebar />

          {/* Chat Interface */}
          <ChatInterface />

          {/* Analytics Panel */}
          <AnalyticsPanel />
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          © 2024 Legal AI Assistant. Powered by <span>Advanced ML Models</span>
        </p>
      </footer>

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />
    </div>
  );
};

export default App;
