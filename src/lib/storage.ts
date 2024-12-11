export type StorageKeys = {
  streamSort: string;
  streamFilter: string;
};

// Type guard to check if we're in Firefox
function isFirefox(): boolean {
  return navigator.userAgent.includes('Firefox');
}

// Get the appropriate storage API
function getStorageAPI() {
  if (isFirefox()) {
    return browser.storage.local;
  }
  return chrome.storage.local;
}

export const storage = {
  async get<T = unknown>(key: keyof StorageKeys): Promise<T | undefined> {
    const storageAPI = getStorageAPI();
    try {
      const result = await storageAPI.get(key);
      return result[key] as T | undefined;
    } catch (error) {
      console.error('Storage get error:', error);
      return undefined;
    }
  },

  async set(key: keyof StorageKeys, value: unknown): Promise<void> {
    const storageAPI = getStorageAPI();
    try {
      await storageAPI.set({ [key]: value });
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }
}; 