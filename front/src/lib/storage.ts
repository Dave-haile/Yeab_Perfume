/**
 * Safe localStorage wrapper — tries to use localStorage, falls back to
 * an in-memory store if unavailable (e.g. private browsing, SSR).
 */

const memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    const key = "__storage_test__";
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

const useLocal = isLocalStorageAvailable();

export const safeStorage = {
  getItem(key: string): string | null {
    if (useLocal) {
      return localStorage.getItem(key);
    }
    return memoryStore[key] ?? null;
  },

  setItem(key: string, value: string): void {
    if (useLocal) {
      localStorage.setItem(key, value);
    } else {
      memoryStore[key] = value;
    }
  },

  removeItem(key: string): void {
    if (useLocal) {
      localStorage.removeItem(key);
    } else {
      delete memoryStore[key];
    }
  },
};
