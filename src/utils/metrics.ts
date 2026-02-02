import { Metrics, Session } from '../models/types';

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

export const computeMetrics = (sessions: Session[]): Metrics => {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const sessionsLast7Days = sessions.filter((session) => {
    const date = new Date(session.date);
    return date >= sevenDaysAgo;
  }).length;

  const volumeByFundamental = sessions.reduce(
    (acc, session) => {
      const increment = session.type === 'timer'
        ? session.durationSec ?? 0
        : session.reps ?? 0;
      acc[session.fundamental] += increment;
      return acc;
    },
    { tir: 0, passe: 0, dribble: 0 },
  );

  const successSessions = sessions.filter(
    (session) => session.result.type === 'makesAttempts',
  );

  const byWeek = new Map<string, { makes: number; attempts: number }>();

  successSessions.forEach((session) => {
    const date = new Date(session.date);
    const label = weekLabel(startOfWeek(date));
    const current = byWeek.get(label) ?? { makes: 0, attempts: 0 };
    const result = session.result;
    byWeek.set(label, {
      makes: current.makes + result.makes,
      attempts: current.attempts + result.attempts,
    });
  });

  const weeklySuccessRates = Array.from(byWeek.entries())
    .map(([label, value]) => ({
      weekLabel: label,
      successRate:
        value.attempts > 0 ? Math.round((value.makes / value.attempts) * 100) : 0,
    }))
    .sort((a, b) => a.weekLabel.localeCompare(b.weekLabel));

  return {
    sessionsLast7Days,
    volumeByFundamental,
    weeklySuccessRates,
  };
};
