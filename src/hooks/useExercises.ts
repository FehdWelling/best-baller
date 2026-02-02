import { useMemo, useState } from 'react';
import { exercises } from '../data/exercises';
import { Exercise, Fundamental } from '../models/types';

export const useExercises = (fundamental?: Fundamental) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const matchesFundamental = fundamental
        ? exercise.fundamental === fundamental
        : true;
      const matchesQuery = normalized
        ? exercise.name.toLowerCase().includes(normalized)
        : true;
      return matchesFundamental && matchesQuery;
    });
  }, [fundamental, query]);

  return {
    query,
    setQuery,
    exercises: filtered,
  } as const satisfies {
    query: string;
    setQuery: (value: string) => void;
    exercises: Exercise[];
  };
};
