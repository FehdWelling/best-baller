import { formatDuration } from '../utils/format';

const assertEqual = (label: string, received: string, expected: string) => {
  if (received !== expected) {
    throw new Error(`${label} attendu ${expected}, reçu ${received}`);
  }
};

export const runFormatTests = () => {
  assertEqual('format 0', formatDuration(0), '0:00');
  assertEqual('format 65', formatDuration(65), '1:05');
};
