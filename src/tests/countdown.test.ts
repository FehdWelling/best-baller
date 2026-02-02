import {
  getNextCountdownValue,
  resetCountdownValue,
  shouldCountdownTick,
} from '../utils/countdownLogic';

const assertEqual = (label: string, received: unknown, expected: unknown) => {
  if (received !== expected) {
    throw new Error(`${label} attendu ${expected}, reçu ${received}`);
  }
};

export const runCountdownTests = () => {
  const shouldTickCases = [
    { label: 'tick actif', current: 3, isActive: true, expected: true },
    { label: 'tick inactif', current: 3, isActive: false, expected: false },
    { label: 'tick à zero', current: 0, isActive: true, expected: false },
  ];

  shouldTickCases.forEach(({ label, current, isActive, expected }) => {
    assertEqual(label, shouldCountdownTick(current, isActive), expected);
  });

  const nextValueCases = [
    { label: 'progression 3->2', current: 3, expected: 2 },
    { label: 'progression 1->0', current: 1, expected: 0 },
    { label: 'ne descend pas sous 0', current: 0, expected: 0 },
  ];

  nextValueCases.forEach(({ label, current, expected }) => {
    assertEqual(label, getNextCountdownValue(current), expected);
  });

  assertEqual('reset à 3', resetCountdownValue(3), 3);
};
