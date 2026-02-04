import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../models/types';

let sessions: Session[] = [];
let listeners: Array<(items: Session[]) => void> = [];
const STORAGE_KEY = 'best-baller:sessions';

const notify = (): void => {
  listeners.forEach((listener) => listener([...sessions]));
};

const persistSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.warn('Failed to persist sessions', error);
  }
};

const loadSessions = async (): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      sessions = parsed as Session[];
      notify();
    }
  } catch (error) {
    console.warn('Failed to load sessions', error);
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
  add(session: Session): void {
    sessions = [session, ...sessions];
    notify();
    void persistSessions();
  },
  clear(): void {
    sessions = [];
    notify();
    void persistSessions();
  },
  subscribe(listener: (items: Session[]) => void): () => void {
    listeners = [...listeners, listener];
    listener([...sessions]);
    return () => {
      listeners = listeners.filter((item) => item !== listener);
    };
  },
};
