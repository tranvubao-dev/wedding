// Storage may be unavailable when browser privacy settings block access.
const createStore = (kind: 'localStorage' | 'sessionStorage') => ({
  getItem(key: string): string | null {
    try {
      return window[kind].getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      window[kind].setItem(key, value);
    } catch {
      /* Keep in-memory state usable. */
    }
  },
  removeItem(key: string): void {
    try {
      window[kind].removeItem(key);
    } catch {
      /* Storage is unavailable. */
    }
  },
});

export const localStore = createStore('localStorage');
export const sessionStore = createStore('sessionStorage');
