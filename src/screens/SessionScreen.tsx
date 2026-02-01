import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TextField } from '../components/TextField';
import { useCountdown } from '../hooks/useCountdown';
import { useTimer } from '../hooks/useTimer';
import { Exercise, Session, SessionResult } from '../models/types';
import { useSessions } from '../hooks/useSessions';
import { formatDuration } from '../utils/format';

export const SessionScreen = ({ exercise, onSaved }: Props) => {
  const { addSession } = useSessions();
  const defaultDuration = exercise.recommended.durationOptionsSec?.[0] ?? 30;
  const defaultReps = exercise.recommended.repsOptions?.[0] ?? 10;
  const defaultRest = exercise.recommended.restRecommendedSec ?? 30;

  const [durationSec, setDurationSec] = useState(defaultDuration.toString());
  const [reps, setReps] = useState(defaultReps.toString());
  const [restSec, setRestSec] = useState(defaultRest.toString());
  const [readyStarted, setReadyStarted] = useState(false);

  const parsedDuration = Math.max(0, Number(durationSec) || 0);
  const parsedReps = Math.max(0, Number(reps) || 0);

  const readyCountdown = exercise.recommended.readyCountdownSec ?? 0;
  const countdownValue = useCountdown(readyCountdown, readyStarted);
  const timer = useTimer(parsedDuration);

  const isShooting = exercise.fundamental === 'tir';
  const [makes, setMakes] = useState('');
  const [attempts, setAttempts] = useState('');
  const [count, setCount] = useState('');

  const canStartTimer = exercise.type === 'timer' && !timer.isRunning;
  const countdownActive = exercise.type === 'timer' && readyStarted && countdownValue > 0;

  const handleStartTimer = () => {
    if (readyCountdown > 0) {
      setReadyStarted(true);
      return;
    }
    timer.start();
  };

  useEffect(() => {
    if (readyStarted && countdownValue === 0 && !timer.isRunning) {
      timer.reset(parsedDuration);
      timer.start();
      setReadyStarted(false);
    }
  }, [countdownValue, parsedDuration, readyStarted, timer]);

  const sessionResult = useMemo<SessionResult>(() => {
    if (isShooting) {
      return {
        type: 'makesAttempts',
        makes: Number(makes) || 0,
        attempts: Number(attempts) || 0,
      };
    }
    return {
      type: 'count',
      count: Number(count) || 0,
    };
  }, [attempts, count, isShooting, makes]);

  const saveSession = () => {
    const session: Session = {
      id: `session-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      exerciseId: exercise.id,
      date: new Date().toISOString(),
      fundamental: exercise.fundamental,
      type: exercise.type,
      durationSec: exercise.type === 'timer' ? parsedDuration : undefined,
      reps: exercise.type === 'reps' ? parsedReps : undefined,
      restSec: Number(restSec) || 0,
      result: sessionResult,
    };
    addSession(session);
    onSaved();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session: {exercise.name}</Text>

      <Card>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        {exercise.type === 'timer' ? (
          <TextField
            label="Durée (sec)"
            value={durationSec}
            onChangeText={setDurationSec}
          />
        ) : (
          <TextField
            label="Répétitions"
            value={reps}
            onChangeText={setReps}
          />
        )}
        <TextField
          label="Repos (sec)"
          value={restSec}
          onChangeText={setRestSec}
        />
      </Card>

      {exercise.type === 'timer' ? (
        <Card>
          <Text style={styles.sectionTitle}>Timer</Text>
          {countdownActive ? (
            <Text style={styles.timer}>{countdownValue}</Text>
          ) : (
            <Text style={styles.timer}>{formatDuration(timer.secondsLeft)}</Text>
          )}
          {canStartTimer ? (
            <Button label="Démarrer" onPress={handleStartTimer} />
          ) : (
            <Button label="Stop" onPress={timer.stop} variant="secondary" />
          )}
        </Card>
      ) : (
        <Card>
          <Text style={styles.sectionTitle}>Compteur de répétitions</Text>
          <Text style={styles.timer}>{parsedReps}</Text>
        </Card>
      )}

      <Card>
        <Text style={styles.sectionTitle}>Résultat</Text>
        {isShooting ? (
          <View style={styles.row}>
            <TextField
              label="Paniers réussis"
              value={makes}
              onChangeText={setMakes}
              placeholder="0"
            />
            <TextField
              label="Tentatives"
              value={attempts}
              onChangeText={setAttempts}
              placeholder="0"
            />
          </View>
        ) : (
          <TextField
            label="Nombre total"
            value={count}
            onChangeText={setCount}
            placeholder="0"
          />
        )}
      </Card>

      <Button label="Sauvegarder localement" onPress={saveSession} />
    </View>
  );
};

type Props = {
  exercise: Exercise;
  onSaved: () => void;
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#111827',
  },
  timer: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
  },
  row: {
    gap: 12,
  },
});
