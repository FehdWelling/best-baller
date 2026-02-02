import { computeMetrics } from '../utils/metrics';
import { Session } from '../models/types';

const assertEqual = (label: string, received: unknown, expected: unknown) => {
  if (received !== expected) {
    throw new Error(`${label} attendu ${expected}, reçu ${received}`);
  }
};

const mockSessions = (): Session[] => [
  {
    id: '1',
    exerciseId: 'tir-arrete-axe',
    date: new Date().toISOString(),
    fundamental: 'tir',
    type: 'reps',
    reps: 20,
    restSec: 30,
    result: { type: 'makesAttempts', makes: 12, attempts: 20 },
  },
  {
    id: '2',
    exerciseId: 'passe-mur-alternee',
    date: new Date().toISOString(),
    fundamental: 'passe',
    type: 'timer',
    durationSec: 60,
    restSec: 30,
    result: { type: 'count', count: 50 },
  },
];

export const runMetricsTests = () => {
  const metrics = computeMetrics(mockSessions());
  assertEqual('sessionsLast7Days', metrics.sessionsLast7Days, 2);
  assertEqual('volume tir', metrics.volumeByFundamental.tir, 20);
  assertEqual('volume passe', metrics.volumeByFundamental.passe, 60);
  assertEqual('volume dribble', metrics.volumeByFundamental.dribble, 0);
};
