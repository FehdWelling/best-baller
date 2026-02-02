import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { TextField } from '../../src/components/TextField';
import { getExerciseById } from '../../src/data/exercises';

const ExerciseDetailScreen = () => {
  const router = useRouter();
  const { exerciseId } = useLocalSearchParams<{ exerciseId?: string }>();
  const exercise = exerciseId ? getExerciseById(exerciseId) : undefined;

  const initialReps = exercise?.recommended.repsOptions?.[0] ?? 10;
  const initialDuration = exercise?.recommended.durationOptionsSec?.[0] ?? 30;
  const initialRest = exercise?.recommended.restRecommendedSec ?? 30;

  const [reps, setReps] = useState(initialReps.toString());
  const [durationSec, setDurationSec] = useState(initialDuration.toString());
  const [restSec, setRestSec] = useState(initialRest.toString());

  const params = useMemo(() => {
    if (!exercise) {
      return undefined;
    }
    return {
      exerciseId: exercise.id,
      reps,
      durationSec,
      restSec,
    };
  }, [durationSec, exercise, reps, restSec]);

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Exercice introuvable</Text>
        <Text>Retourne à la liste pour sélectionner un exercice.</Text>
        <Button label="Retour" onPress={() => router.push('/')} variant="secondary" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>
      <Text style={styles.description}>{exercise.description}</Text>

      <Card>
        <Text style={styles.label}>Objectif</Text>
        <Text>{exercise.objective}</Text>
        <Text style={styles.label}>Type</Text>
        <Text>{exercise.type === 'reps' ? 'Répétitions' : 'Timer'}</Text>
      </Card>

      <Card>
        <Text style={styles.label}>Paramètres</Text>
        {exercise.type === 'reps' ? (
          <TextField label="Répétitions" value={reps} onChangeText={setReps} />
        ) : (
          <TextField
            label="Durée (sec)"
            value={durationSec}
            onChangeText={setDurationSec}
          />
        )}
        <TextField label="Repos (sec)" value={restSec} onChangeText={setRestSec} />
      </Card>

      <Button
        label="Démarrer"
        onPress={() =>
          router.push({
            pathname: '/session/[exerciseId]',
            params: params ?? { exerciseId: exercise.id },
          })
        }
      />
    </View>
  );
};

export default ExerciseDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    color: '#4B5563',
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
  },
});
