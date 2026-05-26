import React from 'react';
import '../../styles/MessageList.css';
import { Message } from '../../hooks/useChat';
import { formatTime } from '../../utils/formatters';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message message-${message.type}`}
        >
          <div className="message-header">
            <span className="message-type">
              {message.type === 'user' ? '👤 You' : message.type === 'error' ? '❌ Error' : '🤖 Assistant'}
            </span>
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
          <div className="message-content">
            {message.content.split('\n').map((line, i) => (
              <p key={i}>{line || ' '}</p>
            ))}
          </div>
          {message.metadata && (
            <div className="message-section">
              {message.metadata.category && (
                <span className="section-badge">{message.metadata.category}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
