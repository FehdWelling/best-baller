import { Session } from '../models/types';

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

export const isSession = (value: unknown): value is Session => {
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

export const sanitizeSessions = (value: unknown): Session[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isSession);
};

export const parseSessionPayload = (
  payload: unknown,
  idOverride?: string,
): Session | null => {
  if (!isRecord(payload)) {
    return null;
  }

  const candidate: Record<string, unknown> =
    idOverride === undefined ? payload : { ...payload, id: idOverride };

  if (!isSession(candidate)) {
    return null;
  }

  return candidate;
};
