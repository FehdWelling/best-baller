export const shouldCountdownTick = (current: number, isActive: boolean) =>
  isActive && current > 0;

export const getNextCountdownValue = (current: number) =>
  current <= 0 ? 0 : current - 1;

export const resetCountdownValue = (nextSeconds: number) => nextSeconds;
