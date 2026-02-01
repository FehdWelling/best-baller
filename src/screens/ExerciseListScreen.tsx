import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { useExercises } from '../hooks/useExercises';
import { Exercise, Fundamental } from '../models/types';

export const ExerciseListScreen = ({ fundamental, onSelect }: Props) => {
  const { query, setQuery, exercises } = useExercises(fundamental);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercices {fundamental}</Text>
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
            <Button label="Voir" onPress={() => onSelect(exercise)} />
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

type Props = {
  fundamental: Fundamental;
  onSelect: (exercise: Exercise) => void;
};

const styles = StyleSheet.create({
  container: {
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
});
