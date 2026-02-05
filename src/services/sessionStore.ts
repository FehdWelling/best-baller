import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../models/types';
import {
  clearCloudSessions,
  fetchCloudSessions,
  mergeSessions,
  upsertCloudSession,
} from './sessionSync';
import { sanitizeSessions } from './sessionValidation';

let sessions: Session[] = [];
let listeners: Array<(items: Session[]) => void> = [];
let hydrated = false;
let syncUserId: string | null = null;
const STORAGE_KEY = 'best-baller:sessions:v1';

const notify = (): void => {
  listeners.forEach((listener) => listener([...sessions]));
};

const persistSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Intentionally ignore persistence errors.
  }
};

const applyCloudMerge = (cloudSessions: Session[]): void => {
  const merged = mergeSessions(sessions, cloudSessions);
  sessions = merged;
  notify();
  void persistSessions();
};

const pullCloudSessions = async (): Promise<void> => {
  if (!syncUserId) {
    return;
  }

  try {
    const cloudSessions = await fetchCloudSessions(syncUserId);
    applyCloudMerge(cloudSessions);
  } catch {
    // Intentionally ignore network failures to keep offline behavior.
  }
};

const loadSessions = async (): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return;
    }
    sessions = sanitizeSessions(parsed);
  } catch {
    // Intentionally ignore storage failures.
  } finally {
    hydrated = true;
    notify();
    void pullCloudSessions();
  }
};

void loadSessions();

export const sessionStore = {
  getAll(): Session[] {
    return [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  },
  getById(id: string): Session | undefined {
    return sessions.find((session) => session.id === id);
  },
  setSyncUser(userId: string | null): void {
    if (syncUserId === userId) {
      return;
    }

    syncUserId = userId;

    if (!syncUserId || !hydrated) {
      return;
    }

    void pullCloudSessions();
  },
  add(session: Session): void {
    sessions = [session, ...sessions];
    notify();
    void persistSessions();

    if (syncUserId) {
      void upsertCloudSession(syncUserId, session).catch(() => {
        // Intentionally ignore cloud sync failures.
      });
    }
  },
  clear(): void {
    sessions = [];
    notify();
    void persistSessions();

    if (syncUserId) {
      void clearCloudSessions(syncUserId).catch(() => {
        // Intentionally ignore cloud sync failures.
      });
    }
  },
  isHydrated(): boolean {
    return hydrated;
  },
  subscribe(listener: (items: Session[]) => void): () => void {
    listeners = [...listeners, listener];
    listener([...sessions]);
    return () => {
      listeners = listeners.filter((item) => item !== listener);
    };
  },
};
