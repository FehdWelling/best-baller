import { useEffect, useState } from 'react';
import { sessionStore } from '../services/sessionStore';
import { Session } from '../models/types';

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>(sessionStore.getAll());
  const [isHydrated, setIsHydrated] = useState<boolean>(
    sessionStore.isHydrated(),
  );

  useEffect(() => {
    const handleUpdate = (items: Session[]) => {
      setSessions(items);
      setIsHydrated(sessionStore.isHydrated());
    };

    return sessionStore.subscribe(handleUpdate);
  }, []);

  return {
    sessions,
    isHydrated,
    addSession: sessionStore.add,
    clearSessions: sessionStore.clear,
  } as const;
};
