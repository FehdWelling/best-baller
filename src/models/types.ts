export type Fundamental = 'tir' | 'passe' | 'dribble';

export type ExerciseType = 'reps' | 'timer';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ExerciseParams = {
  repsOptions?: number[];
  durationOptionsSec?: number[];
  restRecommendedSec?: number;
  readyCountdownSec?: number;
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
  objective: string;
  fundamental: Fundamental;
  type: ExerciseType;
  recommended: ExerciseParams;
  coachingPoints?: string[];
  exampleSession?: string;
};

export type SessionResult =
  | {
      type: 'makesAttempts';
      makes: number;
      attempts: number;
    }
  | {
      type: 'count';
      count: number;
    };

export type Session = {
  id: string;
  exerciseId: string;
  date: string;
  fundamental: Fundamental;
  type: ExerciseType;
  durationSec?: number;
  reps?: number;
  restSec?: number;
  result: SessionResult;
  perceivedDifficulty?: Difficulty;
};

export type WeeklySuccessRate = {
  weekLabel: string;
  successRate: number;
};

export type Metrics = {
  sessionsLast7Days: number;
  volumeByFundamental: Record<Fundamental, number>;
  weeklySuccessRates: WeeklySuccessRate[];
};
