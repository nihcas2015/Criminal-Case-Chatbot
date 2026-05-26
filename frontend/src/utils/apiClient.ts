import { API_BASE_URL, API_ENDPOINTS, HTTP_STATUS, DEFAULTS, ERROR_MESSAGES } from './constants';

// Types
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  message?: string;
}

// API Client
class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor(
    baseUrl: string = API_BASE_URL,
    timeout: number = DEFAULTS.API_TIMEOUT,
    retries: number = DEFAULTS.RETRY_ATTEMPTS
  ) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
    this.defaultRetries = retries;
  }

  /**
   * Make an HTTP request
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
    } = config;

    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const mergedHeaders = { ...defaultHeaders, ...headers };

    let lastError: any = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers: mergedHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get('content-type');
        let data: any;

        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        if (!response.ok) {
          return {
            data: undefined,
            error: data?.error || `HTTP ${response.status}`,
            status: response.status,
            message: data?.message || ERROR_MESSAGES.SERVER_ERROR,
          };
        }

        return {
          data,
          error: undefined,
          status: response.status,
          message: 'Success',
        };
      } catch (error: any) {
        lastError = error;

        if (error.name === 'AbortError') {
          clearTimeout(timeoutId);
          return {
            data: undefined,
            error: ERROR_MESSAGES.TIMEOUT_ERROR,
            status: 408,
            message: ERROR_MESSAGES.TIMEOUT_ERROR,
          };
        }

        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          return {
            data: undefined,
            error: ERROR_MESSAGES.NETWORK_ERROR,
            status: 0,
            message: ERROR_MESSAGES.NETWORK_ERROR,
          };
        }

        if (attempt < retries) {
          const delay = DEFAULTS.RETRY_DELAY * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    clearTimeout(timeoutId);

    return {
      data: undefined,
      error: lastError?.message || ERROR_MESSAGES.SERVER_ERROR,
      status: 0,
      message: lastError?.message || ERROR_MESSAGES.SERVER_ERROR,
    };
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  /**
   * Check server health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.get(API_ENDPOINTS.HEALTH);
      return response.status === HTTP_STATUS.OK;
    } catch {
      return false;
    }
  }

  /**
   * Get API status
   */
  async getStatus() {
    return this.get(API_ENDPOINTS.STATUS);
  }

  /**
   * Send chat message
   */
  async sendChatMessage(message: string) {
    return this.post(API_ENDPOINTS.CHAT, { query: message });
  }

  /**
   * Get chat history
   */
  async getChatHistory(limit?: number) {
    const endpoint = limit ? `${API_ENDPOINTS.HISTORY}?limit=${limit}` : API_ENDPOINTS.HISTORY;
    return this.get(endpoint);
  }

  /**
   * Get analytics
   */
  async getAnalytics(timeframe?: string) {
    const endpoint = timeframe
      ? `${API_ENDPOINTS.ANALYTICS}?timeframe=${timeframe}`
      : API_ENDPOINTS.ANALYTICS;
    return this.get(endpoint);
  }

  /**
   * Set base URL (for dynamic endpoint configuration)
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  /**
   * Get current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Set default timeout
   */
  setDefaultTimeout(timeout: number): void {
    this.defaultTimeout = timeout;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export default ApiClient;
