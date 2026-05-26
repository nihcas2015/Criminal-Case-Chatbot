import React, { useRef, useEffect } from 'react';
import '../../styles/ChatInterface.css';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { useChat, useNotification } from '../../hooks';

const ChatInterface: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearHistory } = useChat();
  const { error: showError } = useNotification();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show error notification
  useEffect(() => {
    if (error) {
      showError(error, 'Chat Error');
    }
  }, [error, showError]);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat messages?')) {
      clearHistory();
    }
  };

  return (
    <div className="chat-interface">
      {/* Messages Container */}
      <div className="chat-messages-container">
        {messages.length === 0 && !isLoading ? (
          <div className="chat-empty">
            <div className="empty-icon">💬</div>
            <h2>Start a Conversation</h2>
            <p>Ask me anything about legal documents, regulations, or case law</p>
            <div className="example-queries">
              <div className="example-title">Example Queries</div>
              <ul>
                <li>What are the key clauses in this contract?</li>
                <li>Analyze this legal document</li>
                <li>What are my legal obligations?</li>
                <li>Summarize this judgment</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <MessageList messages={messages} />
            {isLoading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Processing your request...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Section */}
      <div className="chat-input-section">
        <div className="input-controls">
          <InputBox
            onSendMessage={sendMessage}
            disabled={isLoading}
          />
          <button
            className="clear-button"
            onClick={handleClearHistory}
            disabled={messages.length === 0}
            title="Clear chat history"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
