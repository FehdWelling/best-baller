export type TimerState = {
  secondsLeft: number;
  isRunning: boolean;
};

export const getNextTimerTick = (current: number) => {
  if (current <= 1) {
    return { next: 0, shouldStop: true };
  }
  return { next: current - 1, shouldStop: false };
};

export const startTimerState = (state: TimerState): TimerState => ({
  ...state,
  isRunning: true,
});

export const pauseTimerState = (state: TimerState): TimerState => ({
  ...state,
  isRunning: false,
});

export const resumeTimerState = (state: TimerState): TimerState => ({
  ...state,
  isRunning: true,
});

export const stopTimerState = (state: TimerState): TimerState => ({
  ...state,
  isRunning: false,
});

export const resetTimerState = (
  _state: TimerState,
  nextSeconds: number,
): TimerState => ({
  secondsLeft: nextSeconds,
  isRunning: false,
});

export const tickTimerState = (state: TimerState): TimerState => {
  if (!state.isRunning) {
    return state;
  }
  const { next, shouldStop } = getNextTimerTick(state.secondsLeft);
  return {
    secondsLeft: next,
    isRunning: shouldStop ? false : state.isRunning,
  };
};
