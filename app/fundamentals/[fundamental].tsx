import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { TextField } from '../../src/components/TextField';
import { useExercises } from '../../src/hooks/useExercises';
import { Fundamental } from '../../src/models/types';

const FundamentalScreen = () => {
  const { fundamental } = useLocalSearchParams<{ fundamental?: string }>();
  const selected = normalizeFundamental(fundamental);
  const { exercises, query, setQuery } = useExercises(selected);

  if (!selected) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Fondamental inconnu</Text>
        <Text>Choisis un fondamental valide depuis l’accueil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercices {selected}</Text>
      <TextField
        label="Recherche"
        value={query}
        onChangeText={setQuery}
        placeholder="Nom de l’exercice"
      />
      <ScrollView contentContainerStyle={styles.list}>
        {exercises.map((exercise) => (
          <Card key={exercise.id}>
            <Text style={styles.name}>{exercise.name}</Text>
            <Text style={styles.description}>{exercise.description}</Text>
            <Text style={styles.meta}>
              Type: {exercise.type === 'reps' ? 'Répétitions' : 'Timer'}
            </Text>
            {exercise.recommended.repsOptions ? (
              <Text style={styles.meta}>
                Reps: {exercise.recommended.repsOptions.join(', ')}
              </Text>
            ) : null}
            {exercise.recommended.durationOptionsSec ? (
              <Text style={styles.meta}>
                Durées: {exercise.recommended.durationOptionsSec.join(', ')} sec
              </Text>
            ) : null}
            <Link href={`/exercises/${exercise.id}`} asChild>
              <Button label="Voir" onPress={() => undefined} />
            </Link>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const normalizeFundamental = (value?: string): Fundamental | null => {
  if (value === 'tir' || value === 'passe' || value === 'dribble') {
    return value;
  }
  return null;
};

export default FundamentalScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },
  name: {
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    color: '#4B5563',
  },
  meta: {
    color: '#6B7280',
  },
});
