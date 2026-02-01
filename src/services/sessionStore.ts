import { Session } from '../models/types';

let sessions: Session[] = [];
let listeners: Array<(items: Session[]) => void> = [];

const notify = (): void => {
  listeners.forEach((listener) => listener([...sessions]));
};

export const sessionStore = {
  getAll(): Session[] {
    return [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  },
  add(session: Session): void {
    sessions = [session, ...sessions];
    notify();
  },
  clear(): void {
    sessions = [];
    notify();
  },
  subscribe(listener: (items: Session[]) => void): () => void {
    listeners = [...listeners, listener];
    listener([...sessions]);
    return () => {
      listeners = listeners.filter((item) => item !== listener);
    };
  },
};
