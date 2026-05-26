import React, { useState } from 'react';
import '../../styles/Sidebar.css';
import { useApi } from '../../hooks';

const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('history');
  const { data: status } = useApi<any>('/api/status', 'GET', undefined, true);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <div className="sidebar-content">
            <div className="sidebar-section">
              <div className="section-title">Recent Conversations</div>
              <div className="sidebar-empty">
                <div className="empty-icon">📝</div>
                <div className="empty-message">
                  No conversations yet. Start chatting to see history here.
                </div>
              </div>
            </div>
          </div>
        );

      case 'tools':
        return (
          <div className="sidebar-content">
            <div className="sidebar-section">
              <div className="section-title">Analysis Tools</div>
              <button className="sidebar-button">
                <span className="button-icon">📄</span>
                <span className="button-text">Document Analysis</span>
              </button>
              <button className="sidebar-button">
                <span className="button-icon">⚖️</span>
                <span className="button-text">Legal Terms Search</span>
              </button>
              <button className="sidebar-button">
                <span className="button-icon">📊</span>
                <span className="button-text">Case Law Reference</span>
              </button>
            </div>

            <div className="sidebar-section">
              <div className="section-title">Utilities</div>
              <button className="sidebar-button">
                <span className="button-icon">🔍</span>
                <span className="button-text">Search</span>
              </button>
              <button className="sidebar-button">
                <span className="button-icon">⚙️</span>
                <span className="button-text">Settings</span>
              </button>
            </div>
          </div>
        );

      case 'info':
        return (
          <div className="sidebar-content">
            <div className="sidebar-section">
              <div className="section-title">Statistics</div>
              <div className="stat-item">
                <div className="stat-label">Conversations</div>
                <div className="stat-value">0</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Documents Analyzed</div>
                <div className="stat-value">0</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Response Time</div>
                <div className="stat-value">--</div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="section-title">System Info</div>
              <div className="info-box">
                <span className="info-icon">ℹ️</span>
                <span>Version 1.0.0 - Advanced ML powered legal assistant</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className="title-icon">⚙️</span>
          Assistant
        </div>
        <div className="sidebar-description">Your legal AI companion</div>
      </div>

      {/* Tabs */}
      <div className="sidebar-tabs">
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button
          className={`tab-button ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          Tools
        </button>
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Info
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </aside>
  );
};

export default Sidebar;
