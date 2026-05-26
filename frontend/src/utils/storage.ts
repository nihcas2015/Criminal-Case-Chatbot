import { STORAGE_KEYS } from './constants';

/**
 * Local Storage utility wrapper
 */

class StorageManager {
  /**
   * Set item in local storage
   */
  setItem<T>(key: string, value: T, serialize = true): void {
    try {
      const data = serialize ? JSON.stringify(value) : (value as any);
      localStorage.setItem(key, data);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  /**
   * Get item from local storage
   */
  getItem<T>(key: string, parse = true): T | null {
    try {
      const data = localStorage.getItem(key);
      if (data === null) return null;
      return parse ? JSON.parse(data) : (data as any);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item from local storage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  /**
   * Clear all items from local storage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  /**
   * Check if item exists
   */
  hasItem(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get all keys
   */
  getAllKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  }

  /**
   * Get storage size
   */
  getSize(): number {
    let size = 0;
    try {
      for (const key of Object.keys(localStorage)) {
        size += localStorage.getItem(key)?.length || 0;
      }
    } catch (error) {
      console.error('Error getting storage size:', error);
    }
    return size;
  }

  /**
   * Set item with expiration
   */
  setItemWithExpiry<T>(key: string, value: T, expiryTime: number): void {
    try {
      const item = {
        value,
        expiry: Date.now() + expiryTime,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error setting item with expiry ${key}:`, error);
    }
  }

  /**
   * Get item with expiry check
   */
  getItemWithExpiry<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      if (data === null) return null;

      const item = JSON.parse(data);

      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value as T;
    } catch (error) {
      console.error(`Error getting item with expiry ${key}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const storage = new StorageManager();

/**
 * Chat History Management
 */
export const chatHistoryStorage = {
  /**
   * Save chat history
   */
  save(messages: any[]): void {
    storage.setItem(STORAGE_KEYS.CHAT_HISTORY, messages);
  },

  /**
   * Load chat history
   */
  load(): any[] {
    return storage.getItem(STORAGE_KEYS.CHAT_HISTORY) || [];
  },

  /**
   * Clear chat history
   */
  clear(): void {
    storage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  },

  /**
   * Add message to history
   */
  addMessage(message: any): void {
    const history = this.load();
    history.push(message);
    this.save(history);
  },

  /**
   * Remove message from history
   */
  removeMessage(id: string): void {
    const history = this.load();
    const filtered = history.filter((msg: any) => msg.id !== id);
    this.save(filtered);
  },
};

/**
 * User Preferences Management
 */
export const preferencesStorage = {
  /**
   * Save user preferences
   */
  save(preferences: any): void {
    storage.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  /**
   * Load user preferences
   */
  load(): any {
    return storage.getItem(STORAGE_KEYS.USER_PREFERENCES) || {};
  },

  /**
   * Update preference
   */
  updatePreference(key: string, value: any): void {
    const prefs = this.load();
    prefs[key] = value;
    this.save(prefs);
  },

  /**
   * Get preference
   */
  getPreference(key: string): any {
    const prefs = this.load();
    return prefs[key];
  },

  /**
   * Clear preferences
   */
  clear(): void {
    storage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
  },
};

/**
 * Theme Management
 */
export const themeStorage = {
  /**
   * Save theme
   */
  save(theme: string): void {
    storage.setItem(STORAGE_KEYS.THEME, theme, false);
  },

  /**
   * Load theme
   */
  load(): string {
    return storage.getItem(STORAGE_KEYS.THEME, false) || 'light';
  },

  /**
   * Clear theme
   */
  clear(): void {
    storage.removeItem(STORAGE_KEYS.THEME);
  },
};

/**
 * Sidebar State Management
 */
export const sidebarStorage = {
  /**
   * Save sidebar state
   */
  saveState(collapsed: boolean): void {
    storage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed);
  },

  /**
   * Load sidebar state
   */
  loadState(): boolean {
    return storage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) || false;
  },

  /**
   * Clear sidebar state
   */
  clear(): void {
    storage.removeItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
  },
};

export default StorageManager;
