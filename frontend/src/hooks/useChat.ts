import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { chatHistoryStorage, storage } from '../utils/storage';
import { CHAT_CONFIG } from '../utils/constants';

export interface Message {
  id: string;
  type: 'user' | 'bot' | 'error';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearHistory: () => void;
  getMessage: (id: string) => Message | undefined;
  updateMessage: (id: string, content: string) => void;
  deleteMessage: (id: string) => void;
}

/**
 * Custom hook for managing chat state
 */
export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const history = chatHistoryStorage.load();
        if (history && Array.isArray(history)) {
          setMessages(history);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadHistory();
  }, []);

  // Save messages to storage whenever they change
  useEffect(() => {
    try {
      chatHistoryStorage.save(messages);
    } catch (err) {
      console.error('Failed to save chat history:', err);
    }
  }, [messages]);

  /**
   * Send a message
   */
  const sendMessage = useCallback(
    async (messageText: string) => {
      // Validate input
      if (!messageText.trim()) {
        setError('Message cannot be empty');
        return;
      }

      if (messageText.length > CHAT_CONFIG.MAX_MESSAGE_Length) {
        setError(`Message exceeds maximum length of ${CHAT_CONFIG.MAX_MESSAGE_Length} characters`);
        return;
      }

      // Add user message
      const userMessage: Message = {
        id: `msg_${Date.now()}_user`,
        type: 'user',
        content: messageText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setError(null);
      setIsLoading(true);

      try {
        // Send to API
        const response = await apiClient.sendChatMessage(messageText);

        if (response.error) {
          const errorMessage: Message = {
            id: `msg_${Date.now()}_error`,
            type: 'error',
            content: response.message || 'Failed to get response',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setError(response.message || 'Failed to send message');
        } else {
          // Format bot response with IPC section and judgment info
          const responseData = response.data;
          let botContent = responseData?.response || 'No response';
          
          // Add section info if available
          if (responseData?.section && responseData?.section !== 'UNKNOWN') {
            botContent = `📋 IPC Section: ${responseData.section}\n${responseData.judgment_found ? '✓ Case Law Found' : '⚠️ No case law available'}\n\n${botContent}`;
          }
          
          const botMessage: Message = {
            id: `msg_${Date.now()}_bot`,
            type: 'bot',
            content: botContent,
            timestamp: new Date(),
            metadata: {
              section: responseData?.section,
              judgment_found: responseData?.judgment_found,
              ...responseData?.metadata,
            },
          };
          setMessages((prev) => [...prev, botMessage]);
        }
      } catch (err) {
        const errorMessage: Message = {
          id: `msg_${Date.now()}_error`,
          type: 'error',
          content: err instanceof Error ? err.message : 'An unexpected error occurred',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Clear chat history
   */
  const clearHistory = useCallback(() => {
    setMessages([]);
    chatHistoryStorage.clear();
    setError(null);
  }, []);

  /**
   * Get a specific message
   */
  const getMessage = useCallback(
    (id: string) => {
      return messages.find((msg) => msg.id === id);
    },
    [messages]
  );

  /**
   * Update a message
   */
  const updateMessage = useCallback((id: string, content: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, content } : msg))
    );
  }, []);

  /**
   * Delete a message
   */
  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    chatHistoryStorage.removeMessage(id);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    getMessage,
    updateMessage,
    deleteMessage,
  };
};

export default useChat;
