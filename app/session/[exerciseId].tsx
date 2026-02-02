import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { TextField } from '../../src/components/TextField';
import { getExerciseById } from '../../src/data/exercises';
import { useCountdown } from '../../src/hooks/useCountdown';
import { useSessions } from '../../src/hooks/useSessions';
import { useTimer } from '../../src/hooks/useTimer';
import { Difficulty, Session, SessionResult } from '../../src/models/types';
import { formatDuration } from '../../src/utils/format';

const SessionScreen = () => {
  const { exerciseId, reps, durationSec, restSec } = useLocalSearchParams<{
    exerciseId?: string;
    reps?: string;
    durationSec?: string;
    restSec?: string;
  }>();
  const router = useRouter();
  const { addSession } = useSessions();
  const exercise = exerciseId ? getExerciseById(exerciseId) : undefined;

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Exercice introuvable</Text>
        <Text>Retourne à la liste pour sélectionner un exercice.</Text>
      </View>
    );
  }

  const defaultReps = Number(reps) || exercise.recommended.repsOptions?.[0] || 10;
  const defaultDuration =
    Number(durationSec) || exercise.recommended.durationOptionsSec?.[0] || 30;
  const defaultRest = Number(restSec) || exercise.recommended.restRecommendedSec || 30;

  const [repsValue, setRepsValue] = useState(defaultReps.toString());
  const [durationValue, setDurationValue] = useState(defaultDuration.toString());
  const [restValue, setRestValue] = useState(defaultRest.toString());

  const parsedReps = Math.max(0, Number(repsValue) || 0);
  const parsedDuration = Math.max(0, Number(durationValue) || 0);
  const parsedRest = Math.max(0, Number(restValue) || 0);

  const [readyActive, setReadyActive] = useState(false);
  const readyCountdown = exercise.recommended.readyCountdownSec ?? 0;
  const countdownValue = useCountdown(readyCountdown, readyActive);
  const timer = useTimer(parsedDuration);

  const [makes, setMakes] = useState('');
  const [attempts, setAttempts] = useState('');
  const [count, setCount] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);

  const isShooting = exercise.fundamental === 'tir';
  const countdownActive = exercise.type === 'timer' && readyActive && countdownValue > 0;
  const canStartTimer = exercise.type === 'timer' && !timer.isRunning && !readyActive;

  useEffect(() => {
    if (readyActive && countdownValue === 0 && !timer.isRunning) {
      timer.reset(parsedDuration);
      timer.start();
      setReadyActive(false);
    }
  }, [countdownValue, parsedDuration, readyActive, timer]);

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

  const successRate = useMemo(() => {
    if (sessionResult.type !== 'makesAttempts' || sessionResult.attempts === 0) {
      return 0;
    }
    return Math.round((sessionResult.makes / sessionResult.attempts) * 100);
  }, [sessionResult]);

  const handleStartTimer = () => {
    if (readyCountdown > 0) {
      setReadyActive(true);
      return;
    }
    timer.start();
  };

  const handleStopTimer = () => {
    timer.stop();
    timer.reset(parsedDuration);
  };

  const saveSession = () => {
    const session: Session = {
      id: `session-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      exerciseId: exercise.id,
      date: new Date().toISOString(),
      fundamental: exercise.fundamental,
      type: exercise.type,
      durationSec: exercise.type === 'timer' ? parsedDuration : undefined,
      reps: exercise.type === 'reps' ? parsedReps : undefined,
      restSec: parsedRest,
      result: sessionResult,
      perceivedDifficulty: difficulty,
    };
    addSession(session);
    router.push('/history');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session: {exercise.name}</Text>

      <Card>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        {exercise.type === 'timer' ? (
          <TextField
            label="Durée (sec)"
            value={durationValue}
            onChangeText={setDurationValue}
          />
        ) : (
          <TextField
            label="Répétitions"
            value={repsValue}
            onChangeText={setRepsValue}
          />
        )}
        <TextField label="Repos (sec)" value={restValue} onChangeText={setRestValue} />
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
            <View style={styles.row}>
              <Button
                label={timer.isRunning ? 'Pause' : 'Reprendre'}
                onPress={timer.isRunning ? timer.stop : timer.start}
                variant="secondary"
              />
              <Button label="Stop" onPress={handleStopTimer} variant="secondary" />
            </View>
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
        {isShooting ? (
          <Text style={styles.meta}>Réussite: {successRate}%</Text>
        ) : null}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Difficulté perçue (optionnel)</Text>
        <View style={styles.row}>
          <Button
            label="Facile"
            onPress={() => setDifficulty('easy')}
            variant={difficulty === 'easy' ? 'primary' : 'secondary'}
          />
          <Button
            label="Moyen"
            onPress={() => setDifficulty('medium')}
            variant={difficulty === 'medium' ? 'primary' : 'secondary'}
          />
          <Button
            label="Difficile"
            onPress={() => setDifficulty('hard')}
            variant={difficulty === 'hard' ? 'primary' : 'secondary'}
          />
        </View>
      </Card>

      <Button label="Sauvegarder localement" onPress={saveSession} />
    </View>
  );
};

export default SessionScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  meta: {
    color: '#6B7280',
    marginTop: 8,
  },
});
