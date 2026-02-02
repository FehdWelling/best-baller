import {
  getNextTimerTick,
  pauseTimerState,
  resetTimerState,
  resumeTimerState,
  startTimerState,
  stopTimerState,
  tickTimerState,
  TimerState,
} from '../utils/timerLogic';

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

export const runTimerTests = () => {
  const tickCases = [
    { label: 'tick 10->9', current: 10, expected: { next: 9, shouldStop: false } },
    { label: 'tick 1->0 stop', current: 1, expected: { next: 0, shouldStop: true } },
    { label: 'tick 0 stays', current: 0, expected: { next: 0, shouldStop: true } },
  ];

  tickCases.forEach(({ label, current, expected }) => {
    assertDeepEqual(label, getNextTimerTick(current), expected);
  });

  const baseState: TimerState = { secondsLeft: 5, isRunning: false };
  assertDeepEqual('start', startTimerState(baseState), {
    secondsLeft: 5,
    isRunning: true,
  });
  assertDeepEqual('pause', pauseTimerState({ ...baseState, isRunning: true }), {
    secondsLeft: 5,
    isRunning: false,
  });
  assertDeepEqual('resume', resumeTimerState(baseState), {
    secondsLeft: 5,
    isRunning: true,
  });
  assertDeepEqual('stop', stopTimerState({ ...baseState, isRunning: true }), {
    secondsLeft: 5,
    isRunning: false,
  });
  assertDeepEqual('reset', resetTimerState(baseState, 12), {
    secondsLeft: 12,
    isRunning: false,
  });

  const runningState: TimerState = { secondsLeft: 3, isRunning: true };
  assertDeepEqual('tick running 3->2', tickTimerState(runningState), {
    secondsLeft: 2,
    isRunning: true,
  });
  assertDeepEqual('tick running 1->0 stops', tickTimerState({ secondsLeft: 1, isRunning: true }), {
    secondsLeft: 0,
    isRunning: false,
  });
  assertDeepEqual('tick paused stays', tickTimerState({ secondsLeft: 2, isRunning: false }), {
    secondsLeft: 2,
    isRunning: false,
  });
  assertEqual('ne descend jamais sous 0', tickTimerState({ secondsLeft: 0, isRunning: true }).secondsLeft, 0);
};
