import React from 'react';
import '../../styles/AnalyticsPanel.css';
import { useApi } from '../../hooks';

interface AnalyticsData {
  totalMessages: number;
  totalConversations: number;
  averageResponseTime: number;
  successRate: number;
}

const AnalyticsPanel: React.FC = () => {
  const { data: analytics } = useApi<AnalyticsData>(
    '/api/analytics',
    'GET',
    undefined,
    true
  );

  const formatMetric = (value: any, type: string) => {
    if (value === null || value === undefined) return '--';
    
    switch (type) {
      case 'number':
        return value.toLocaleString();
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'time':
        return `${value.toFixed(2)}s`;
      default:
        return value;
    }
  };

  return (
    <div className="analytics-panel">
      {/* Header */}
      <div className="panel-header">
        <h2 className="panel-title">
          <span className="title-icon">📊</span>
          Analytics
        </h2>
        <p className="panel-subtitle">Real-time performance metrics</p>
      </div>

      {/* Content */}
      <div className="panel-content">
        {/* Stat Cards */}
        <div className="stat-card">
          <div className="stat-label">Total Messages</div>
          <div className="stat-value">
            {formatMetric(analytics?.totalMessages, 'number')}
          </div>
          <span className="stat-change positive">↑ 0%</span>
        </div>

        <div className="stat-card variant-success">
          <div className="stat-label">Conversations</div>
          <div className="stat-value">
            {formatMetric(analytics?.totalConversations, 'number')}
          </div>
          <span className="stat-change positive">↑ 0%</span>
        </div>

        <div className="stat-card variant-warning">
          <div className="stat-label">Avg Response Time</div>
          <div className="stat-value">
            {formatMetric(analytics?.averageResponseTime, 'time')}
          </div>
          <span className="stat-change positive">↓ 0%</span>
        </div>

        <div className="stat-card variant-danger">
          <div className="stat-label">Success Rate</div>
          <div className="stat-value">
            {formatMetric(analytics?.successRate, 'percentage')}
          </div>
          <span className="stat-change positive">↑ 0%</span>
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <div className="chart-title">Response Time Trend</div>
          <div className="chart-placeholder">
            📈 Chart will appear here
          </div>
        </div>

        {/* Activity List */}
        <div>
          <div className="chart-title">Recent Activity</div>
          <div className="activity-list">
            <div className="activity-item">
              <span>No activity yet</span>
              <div className="activity-time">--</div>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="info-message">
          <span className="info-icon">ℹ️</span>
          <div>
            <strong>Analytics are updated in real-time</strong>
            <p style={{ marginTop: '0.25rem', marginBottom: 0 }}>
              Metrics include all conversations and interactions in this session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
