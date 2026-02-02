import { useEffect, useState } from 'react';

export const useCountdown = (seconds: number, isActive: boolean) => {
  const [value, setValue] = useState(seconds);

  useEffect(() => {
    setValue(seconds);
  }, [seconds, isActive]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    if (value <= 0) {
      return;
    }
    const timer = setTimeout(() => {
      setValue((current) => current - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isActive, value]);

  return value;
};
