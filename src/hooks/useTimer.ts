import { useCallback, useEffect, useRef, useState } from 'react';

export const useTimer = (initialSeconds: number) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) {
      return;
    }
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clear();
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }, [clear]);

  const reset = useCallback(
    (nextSeconds: number) => {
      clear();
      setIsRunning(false);
      setSecondsLeft(nextSeconds);
    },
    [clear],
  );

  const stop = useCallback(() => {
    clear();
    setIsRunning(false);
  }, [clear]);

  useEffect(() => () => clear(), [clear]);

  return {
    secondsLeft,
    isRunning,
    start,
    stop,
    reset,
  } as const;
};
