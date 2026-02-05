import { Session } from '../models/types';

const toLatestById = (items: Session[]): Map<string, Session> => {
  return items.reduce((map, item) => {
    const current = map.get(item.id);

    if (!current || item.date.localeCompare(current.date) >= 0) {
      map.set(item.id, item);
    }

    return map;
  }, new Map<string, Session>());
};

export const mergeSessions = (local: Session[], remote: Session[]): Session[] => {
  const mergedMap = toLatestById(local);

  remote.forEach((remoteSession) => {
    const localSession = mergedMap.get(remoteSession.id);

    if (!localSession || remoteSession.date.localeCompare(localSession.date) >= 0) {
      mergedMap.set(remoteSession.id, remoteSession);
    }
  });

  return [...mergedMap.values()].sort((a, b) => b.date.localeCompare(a.date));
};
