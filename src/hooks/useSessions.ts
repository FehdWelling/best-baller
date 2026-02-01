import { useEffect, useState } from 'react';
import { sessionStore } from '../services/sessionStore';
import { Session } from '../models/types';

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>(sessionStore.getAll());

  useEffect(() => sessionStore.subscribe(setSessions), []);

  return {
    sessions,
    addSession: sessionStore.add,
    clearSessions: sessionStore.clear,
  } as const;
};
