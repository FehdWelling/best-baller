import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { getExerciseById } from '../../src/data/exercises';
import { sessionStore } from '../../src/services/sessionStore';
import { formatDateLabel } from '../../src/utils/format';

const SessionDetailScreen = () => {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const session = sessionId ? sessionStore.getById(sessionId) : undefined;
  const exercise = session ? getExerciseById(session.exerciseId) : undefined;

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Session introuvable</Text>
        <Text>Retourne à l’historique pour sélectionner une session.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail de session</Text>
      <Card>
        <Text style={styles.label}>{formatDateLabel(session.date)}</Text>
        <Text>Exercice: {exercise?.name ?? 'Exercice inconnu'}</Text>
        <Text>Fondamental: {session.fundamental}</Text>
        <Text>
          {session.type === 'timer'
            ? `Durée: ${session.durationSec ?? 0} sec`
            : `Répétitions: ${session.reps ?? 0}`}
        </Text>
        {session.result.type === 'makesAttempts' ? (
          <Text>
            Paniers: {session.result.makes}/{session.result.attempts}
          </Text>
        ) : (
          <Text>Nombre: {session.result.count}</Text>
        )}
        {session.perceivedDifficulty ? (
          <Text>Difficulté: {formatDifficulty(session.perceivedDifficulty)}</Text>
        ) : null}
      </Card>
    </View>
  );
};

const formatDifficulty = (value: 'easy' | 'medium' | 'hard') => {
  switch (value) {
    case 'easy':
      return 'Facile';
    case 'medium':
      return 'Moyen';
    case 'hard':
      return 'Difficile';
    default:
      return 'Inconnu';
  }
};

export default SessionDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    fontWeight: '600',
  },
});
