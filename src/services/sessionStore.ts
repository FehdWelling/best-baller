import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../models/types';

let sessions: Session[] = [];
let listeners: Array<(items: Session[]) => void> = [];
const STORAGE_KEY = 'best-baller:sessions:v1';

const notify = (): void => {
  listeners.forEach((listener) => listener([...sessions]));
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isSessionResult = (value: unknown): boolean => {
  if (!isRecord(value) || !isString(value.type)) {
    return false;
  }

  if (value.type === 'makesAttempts') {
    return isNumber(value.makes) && isNumber(value.attempts);
  }

  if (value.type === 'count') {
    return isNumber(value.count);
  }

  return false;
};

const isSession = (value: unknown): value is Session => {
  if (!isRecord(value)) {
    return false;
  }

  const hasRequiredStrings =
    isString(value.id) &&
    isString(value.exerciseId) &&
    isString(value.date) &&
    (value.fundamental === 'tir' ||
      value.fundamental === 'passe' ||
      value.fundamental === 'dribble') &&
    (value.type === 'reps' || value.type === 'timer');

  if (!hasRequiredStrings || !isSessionResult(value.result)) {
    return false;
  }

  const optionalNumberFields: Array<'durationSec' | 'reps' | 'restSec'> = [
    'durationSec',
    'reps',
    'restSec',
  ];

  for (const field of optionalNumberFields) {
    const fieldValue = value[field];
    if (fieldValue !== undefined && !isNumber(fieldValue)) {
      return false;
    }
  }

  if (
    value.perceivedDifficulty !== undefined &&
    value.perceivedDifficulty !== 'easy' &&
    value.perceivedDifficulty !== 'medium' &&
    value.perceivedDifficulty !== 'hard'
  ) {
    return false;
  }

  return true;
};

const sanitizeSessions = (value: unknown): Session[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isSession);
};

const persistSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Intentionally ignore persistence errors.
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
    notify();
  } catch {
    // Intentionally ignore storage failures.
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
