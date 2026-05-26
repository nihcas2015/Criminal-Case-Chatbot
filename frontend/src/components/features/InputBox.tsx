import React, { useState, useRef, useEffect } from 'react';
import '../../styles/InputBox.css';
import { useDebounce } from '../../hooks';

interface InputBoxProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debouncedMessage = useDebounce(message, 300);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newRows = Math.min(Math.ceil(e.target.value.length / 50), 5);
      setRows(Math.max(1, newRows));
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || disabled) {
      return;
    }

    await onSendMessage(message);
    setMessage('');
    setRows(1);

    // Reset textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  return (
    <form className="input-box" onSubmit={handleSendMessage}>
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="input-textarea"
          placeholder="Type your question here... (Shift+Enter for new line)"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={rows}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!message.trim() || disabled}
          title="Send message"
        >
          <span className="send-icon">📤</span>
        </button>
      </div>
      <div className="input-hint">
        <small>
          {message.length > 0 && `${message.length}/2000`}
          {message.length === 0 && 'Use Shift+Enter for multiline message'}
        </small>
      </div>
    </form>
  );
};

export default InputBox;
