import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from './src/components/Button';
import { Exercise } from './src/models/types';
import { HomeScreen } from './src/screens/HomeScreen';
import { ExerciseListScreen } from './src/screens/ExerciseListScreen';
import { ExerciseDetailScreen } from './src/screens/ExerciseDetailScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';

export const App = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedFundamental, setSelectedFundamental] = useState<
    ScreenState['fundamental']
  >(undefined);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const goHome = () => {
    setScreen('home');
    setSelectedExercise(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>BestBaller</Text>
          <View style={styles.nav}>
            <Button label="Accueil" onPress={goHome} variant="secondary" />
            <Button
              label="Historique"
              onPress={() => setScreen('history')}
              variant="secondary"
            />
            <Button
              label="Progression"
              onPress={() => setScreen('progress')}
              variant="secondary"
            />
          </View>
        </View>

        {screen === 'home' && (
          <HomeScreen
            onSelectFundamental={(fundamental) => {
              setSelectedFundamental(fundamental);
              setScreen('list');
            }}
          />
        )}

        {screen === 'list' && selectedFundamental && (
          <ExerciseListScreen
            fundamental={selectedFundamental}
            onSelect={(exercise) => {
              setSelectedExercise(exercise);
              setScreen('detail');
            }}
          />
        )}

        {screen === 'detail' && selectedExercise && (
          <ExerciseDetailScreen
            exercise={selectedExercise}
            onStartSession={() => setScreen('session')}
          />
        )}

        {screen === 'session' && selectedExercise && (
          <SessionScreen
            exercise={selectedExercise}
            onSaved={() => setScreen('history')}
          />
        )}

        {screen === 'history' && <HistoryScreen />}

        {screen === 'progress' && <ProgressScreen />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

type ScreenState = {
  fundamental?: 'tir' | 'passe' | 'dribble';
};

type Screen = 'home' | 'list' | 'detail' | 'session' | 'history' | 'progress';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    padding: 20,
    gap: 20,
  },
  topBar: {
    gap: 12,
  },
  brand: {
    fontSize: 24,
    fontWeight: '700',
  },
  nav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
