import { formatDuration } from '../utils/format';

const assertEqual = (label: string, received: string, expected: string) => {
  if (received !== expected) {
    throw new Error(`${label} attendu ${expected}, reçu ${received}`);
  }
};

export const runFormatTests = () => {
  const cases = [
    { label: 'format 0', input: 0, expected: '0:00' },
    { label: 'format 61', input: 61, expected: '1:01' },
    { label: 'format 65', input: 65, expected: '1:05' },
    { label: 'format 3599', input: 3599, expected: '59:59' },
    { label: 'format negative', input: -5, expected: '0:00' },
    { label: 'format float', input: 5.9, expected: '0:05' },
  ];

  cases.forEach(({ label, input, expected }) => {
    assertEqual(label, formatDuration(input), expected);
  });
};
