import { Session } from '../../models/types';

const now = new Date();

export const isoDaysFromNow = (offsetDays: number) => {
  const date = new Date(now);
  date.setDate(now.getDate() + offsetDays);
  return date.toISOString();
};

export const buildSession = (overrides: Partial<Session>): Session => ({
  id: 'session',
  exerciseId: 'exercise',
  date: isoDaysFromNow(0),
  fundamental: 'tir',
  type: 'reps',
  reps: 0,
  restSec: 0,
  result: { type: 'count', count: 0 },
  ...overrides,
});
