import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Exercise } from '../models/types';

export const ExerciseDetailScreen = ({
  exercise,
  onStartSession,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>
      <Text style={styles.description}>{exercise.description}</Text>
      <Card>
        <Text style={styles.label}>Objectif</Text>
        <Text>{exercise.objective}</Text>
        <Text style={styles.label}>Type</Text>
        <Text>{exercise.type === 'reps' ? 'Répétitions' : 'Timer'}</Text>
        <Text style={styles.label}>Paramètres recommandés</Text>
        {exercise.recommended.repsOptions ? (
          <Text>
            Répétitions: {exercise.recommended.repsOptions.join(', ')}
          </Text>
        ) : null}
        {exercise.recommended.durationOptionsSec ? (
          <Text>
            Durées: {exercise.recommended.durationOptionsSec.join(', ')} sec
          </Text>
        ) : null}
        {exercise.recommended.restRecommendedSec ? (
          <Text>Repos: {exercise.recommended.restRecommendedSec} sec</Text>
        ) : null}
      </Card>
      <Button label="Démarrer une session" onPress={onStartSession} />
    </View>
  );
};

type Props = {
  exercise: Exercise;
  onStartSession: () => void;
};

const styles = StyleSheet.create({
  container: {
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
