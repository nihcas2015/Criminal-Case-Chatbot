// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Chat API Endpoints
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  HISTORY: '/api/history',
  STATUS: '/api/status',
  ANALYTICS: '/api/analytics',
  HEALTH: '/api/health',
};

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_Length: 2000,
  MAX_HISTORY_DISPLAY: 50,
  MESSAGE_DEBOUNCE_TIME: 300,
  TYPING_INDICATOR_DURATION: 3000,
  AUTO_SCROLL_THRESHOLD: 100,
};

// UI Configuration
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 280,
  ANALYTICS_PANEL_WIDTH: 320,
  MESSAGE_ANIMATION_DURATION: 300,
  NOTIFICATION_DURATION: 5000,
  MODAL_ANIMATION_DURATION: 200,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_INPUT: 'Invalid input. Please check your message.',
  CHAT_FAILED: 'Failed to send message. Please try again.',
  HISTORY_FAILED: 'Failed to load chat history.',
  STATUS_FAILED: 'Failed to fetch status.',
  ANALYTICS_FAILED: 'Failed to load analytics.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CHAT_SENT: 'Message sent successfully.',
  CHAT_CLEARED: 'Chat history cleared.',
  SETTINGS_SAVED: 'Settings saved successfully.',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)$/,
  JSON: /^[\]{}\s:,"0-9a-zA-Z\-\.]*$/,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'chat_history',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  NOTIFICATION_HISTORY: 'notification_history',
};

// Time Constants
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  ISO_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Message Types
export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
  SYSTEM: 'system',
  ERROR: 'error',
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_HISTORY_CLEARED: 'chat_history_cleared',
  SETTINGS_CHANGED: 'settings_changed',
  APP_LOADED: 'app_loaded',
  ERROR_OCCURRED: 'error_occurred',
};

// Default Values
export const DEFAULTS = {
  CHAT_HISTORY_SIZE: 100,
  NOTIFICATION_TIMEOUT: 5000,
  API_TIMEOUT: 1200000,  // 20 minutes - for deepseek-r1:1.5b reasoning model
  RETRY_ATTEMPTS: 1,     // Disable retries for long operations
  RETRY_DELAY: 1000,
};

// Validation Rules
export const VALIDATION_RULES = {
  MIN_MESSAGE_LENGTH: 1,
  MAX_MESSAGE_LENGTH: 2000,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_ANALYTICS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_HISTORY: true,
};
