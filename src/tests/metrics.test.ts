import { computeMetrics } from '../utils/metrics';
import { buildSession, isoDaysFromNow } from './fixtures/sessions';

const assertEqual = (label: string, received: unknown, expected: unknown) => {
  if (received !== expected) {
    throw new Error(`${label} attendu ${expected}, reçu ${received}`);
  }
};

const assertDeepEqual = (label: string, received: unknown, expected: unknown) => {
  const receivedJson = JSON.stringify(received);
  const expectedJson = JSON.stringify(expected);
  if (receivedJson !== expectedJson) {
    throw new Error(`${label} attendu ${expectedJson}, reçu ${receivedJson}`);
  }
};

const startOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(date);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

const weekLabel = (date: Date) =>
  date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  });

const labelForOffset = (offsetDays: number) => {
  const date = new Date(isoDaysFromNow(offsetDays));
  return weekLabel(startOfWeek(date));
};

export const runMetricsTests = () => {
  const sessions = [
    buildSession({
      id: '1',
      date: isoDaysFromNow(-1),
      fundamental: 'tir',
      type: 'reps',
      reps: 20,
      result: { type: 'makesAttempts', makes: 12, attempts: 20 },
    }),
    buildSession({
      id: '2',
      date: isoDaysFromNow(-2),
      fundamental: 'tir',
      type: 'reps',
      reps: 10,
      result: { type: 'makesAttempts', makes: 7, attempts: 10 },
    }),
    buildSession({
      id: '3',
      date: isoDaysFromNow(-3),
      fundamental: 'passe',
      type: 'timer',
      durationSec: 60,
      result: { type: 'count', count: 50 },
    }),
    buildSession({
      id: '4',
      date: isoDaysFromNow(-10),
      fundamental: 'dribble',
      type: 'timer',
      durationSec: 45,
      result: { type: 'count', count: 30 },
    }),
    buildSession({
      id: '5',
      date: isoDaysFromNow(-1),
      fundamental: 'dribble',
      type: 'reps',
      reps: undefined,
      result: { type: 'count', count: 0 },
    }),
    buildSession({
      id: '6',
      date: isoDaysFromNow(2),
      fundamental: 'tir',
      type: 'reps',
      reps: 50,
      result: { type: 'makesAttempts', makes: 40, attempts: 50 },
    }),
    buildSession({
      id: '7',
      date: 'date-invalide',
      fundamental: 'passe',
      type: 'timer',
      durationSec: 120,
      result: { type: 'count', count: 10 },
    }),
  ];

  const metrics = computeMetrics(sessions);
  assertEqual('sessionsLast7Days', metrics.sessionsLast7Days, 5);
  assertEqual('volume tir', metrics.volumeByFundamental.tir, 80);
  assertEqual('volume passe', metrics.volumeByFundamental.passe, 180);
  assertEqual('volume dribble', metrics.volumeByFundamental.dribble, 45);

  const successByWeek = new Map<string, { makes: number; attempts: number }>();

  [
    { offset: -1, makes: 12, attempts: 20 },
    { offset: -2, makes: 7, attempts: 10 },
    { offset: 2, makes: 40, attempts: 50 },
  ].forEach(({ offset, makes, attempts }) => {
    const label = labelForOffset(offset);
    const current = successByWeek.get(label) ?? { makes: 0, attempts: 0 };
    successByWeek.set(label, {
      makes: current.makes + makes,
      attempts: current.attempts + attempts,
    });
  });

  const expectedWeeklyRates = Array.from(successByWeek.entries())
    .map(([weekLabel, value]) => ({
      weekLabel,
      successRate:
        value.attempts > 0 ? Math.round((value.makes / value.attempts) * 100) : 0,
    }))
    .sort((a, b) => a.weekLabel.localeCompare(b.weekLabel));

  assertDeepEqual('weeklySuccessRates', metrics.weeklySuccessRates, expectedWeeklyRates);

  const emptyMetrics = computeMetrics([]);
  assertEqual('sessions empty', emptyMetrics.sessionsLast7Days, 0);
  assertDeepEqual('volume empty', emptyMetrics.volumeByFundamental, {
    tir: 0,
    passe: 0,
    dribble: 0,
  });
  assertDeepEqual('weekly empty', emptyMetrics.weeklySuccessRates, []);
};
