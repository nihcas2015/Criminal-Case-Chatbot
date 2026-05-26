/**
 * Common type definitions
 */

// API Response Types
export interface ApiErrorResponse {
  error: string;
  message: string;
  status: number;
  details?: Record<string, any>;
}

export interface ApiSuccessResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  message: string;
  metadata?: Record<string, any>;
  conversationId?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface Analytics {
  totalMessages: number;
  totalConversations: number;
  averageResponseTime: number;
  successRate: number;
  errorRate: number;
  userEngagement: number;
}

// Status Types
export interface SystemStatus {
  apiHealth: 'healthy' | 'degraded' | 'down';
  uptime: number;
  version: string;
  lastUpdated: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  pageSize: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form Types
export interface FormField {
  name: string;
  value: any;
  error?: string;
  touched?: boolean;
  dirty?: boolean;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  dirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  closeOnBackdropClick?: boolean;
}

// Notification Types
export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Loading State Types
export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
  timestamp: string;
}

// Sidebar Types
export interface SidebarTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
}

export interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
}

// Analytics Panel Types
export interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }>;
}

// Theme Types
export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    background: string;
    text: string;
  };
}

// Configuration Types
export interface AppConfig {
  apiUrl: string;
  apiTimeout: number;
  maxRetries: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  environment: 'development' | 'staging' | 'production';
}

// Event Types
export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: string;
  source?: string;
}

// Action Types (for Redux-like state management)
export interface Action<T = any> {
  type: string;
  payload?: T;
  error?: boolean;
  meta?: Record<string, any>;
}

// Generic Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Async<T> = Promise<T>;

// Utility Types
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
  : T;

export type AsyncFunction<T = any, Args extends any[] = any[]> = (
  ...args: Args
) => Promise<T>;

export type Callback<T = any> = (...args: any[]) => T;
