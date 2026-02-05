import { Session } from '../models/types';
import { mergeSessions } from '../services/sessionMerge';
import { parseSessionPayload } from '../services/sessionValidation';

const assert = (label: string, condition: boolean): void => {
  if (!condition) {
    throw new Error(label);
  }
};

const assertIds = (label: string, items: Session[], expected: string[]): void => {
  const received = items.map((item) => item.id);
  const ok =
    received.length === expected.length &&
    received.every((value, index) => value === expected[index]);

  assert(
    `${label} attendu [${expected.join(',')}], reçu [${received.join(',')}]`,
    ok,
  );
};

const session = (id: string, date: string, reps = 10): Session => ({
  id,
  exerciseId: `exercise-${id}`,
  date,
  fundamental: 'tir',
  type: 'reps',
  reps,
  result: { type: 'count', count: reps },
});

export const runSessionSyncTests = (): void => {
  const localOnly = mergeSessions(
    [session('l1', '2024-06-01T10:00:00.000Z')],
    [],
  );
  assertIds('merge local only', localOnly, ['l1']);

  const remoteOnly = mergeSessions(
    [],
    [session('r1', '2024-06-01T11:00:00.000Z')],
  );
  assertIds('merge remote only', remoteOnly, ['r1']);

  const conflict = mergeSessions(
    [session('same', '2024-06-01T10:00:00.000Z', 10)],
    [session('same', '2024-06-01T12:00:00.000Z', 20)],
  );
  assertIds('merge conflict ids', conflict, ['same']);
  assert('merge conflict last-write-wins', conflict[0]?.reps === 20);

  const dedup = mergeSessions(
    [
      session('dup', '2024-06-01T09:00:00.000Z', 5),
      session('dup', '2024-06-01T10:00:00.000Z', 6),
    ],
    [
      session('dup', '2024-06-01T08:00:00.000Z', 4),
      session('new', '2024-06-01T11:00:00.000Z', 7),
    ],
  );
  assertIds('merge dedup sorting', dedup, ['new', 'dup']);
  assert('merge dedup keeps latest duplicate', dedup[1]?.reps === 6);

  const validPayload = parseSessionPayload(
    {
      id: 'payload',
      exerciseId: 'exercise-payload',
      date: '2024-06-01T10:00:00.000Z',
      fundamental: 'dribble',
      type: 'timer',
      durationSec: 120,
      result: { type: 'count', count: 3 },
    },
    'payload-row-id',
  );
  assert('parse payload valid', validPayload !== null);
  assert('parse payload id override', validPayload?.id === 'payload-row-id');

  const invalidPayload = parseSessionPayload({
    id: 'bad',
    exerciseId: 'exercise-bad',
    date: '2024-06-01T10:00:00.000Z',
    fundamental: 'tir',
    type: 'reps',
    result: { type: 'count', count: 'NaN' },
  });
  assert('parse payload invalid', invalidPayload === null);
};
