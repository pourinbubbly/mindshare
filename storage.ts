
import { User, Region } from './types';

// DYNAMIC API URL CONFIGURATION
const getApiUrl = () => {
    // Use relative path to leverage Vite Proxy
    return '/api';
};

const API_URL = getApiUrl();

const LOCAL_STORAGE_KEY = 'mindshare_nexus_db_v1';
const SESSION_KEY = 'mindshare_nexus_session_v1';

// Helper functions for LocalStorage Fallback
const getLocalDB = (): User[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalDB = (users: User[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("LocalStorage quota exceeded or disabled", e);
  }
};

export interface UserSession {
  discordUsername: string;
  region: Region;
}

export const SessionService = {
  saveSession: (session: UserSession) => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session', e);
    }
  },
  getSession: (): UserSession | null => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};

export const UserService = {
  // Fetch all users from the Backend API
  // Falls back to LocalStorage if backend is offline
  getAllUsers: async (): Promise<User[]> => {
    try {
      // Try fetching from real backend with a short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout to prevent UI lag
      
      const response = await fetch(`${API_URL}/users`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to fetch users from backend');
      }
      const data = await response.json();
      
      // Sync Backend Data to LocalStorage for redundancy
      saveLocalDB(data);
      
      return data;
    } catch (e) {
      console.warn('Backend unreachable (offline or blocked), switching to LocalStorage mode.');
      // Fallback: Get from LocalStorage
      return getLocalDB().sort((a, b) => b.mindshareScore - a.mindshareScore);
    }
  },

  // Check if a Discord ID is already registered
  checkDiscordExists: async (discordId: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${API_URL}/users/check/${encodeURIComponent(discordId)}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Backend check failed');
      const data = await response.json();
      return data.exists;
    } catch (e) {
      // Fallback
      const users = getLocalDB();
      return users.some(u => u.discordUsername.toLowerCase() === discordId.toLowerCase());
    }
  },

  // Save a new user or update existing
  registerUser: async (user: User): Promise<void> => {
    // 1. ALWAYS save to LocalStorage first as a fail-safe.
    const localUsers = getLocalDB();
    const existingIndex = localUsers.findIndex(u => u.discordUsername === user.discordUsername);

    if (existingIndex >= 0) {
        localUsers[existingIndex] = user;
    } else {
        localUsers.push(user);
    }
    saveLocalDB(localUsers);

    // 2. Try Persisting to Backend
    try {
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    } catch (e) {
      console.warn('Backend unreachable during registration. Data saved locally only.');
    }
  }
};