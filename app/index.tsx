import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BestBaller</Text>
      <Text style={styles.subtitle}>Choisis un fondamental pour démarrer.</Text>

      <View style={styles.cards}>
        <Pressable onPress={() => router.push('/fundamentals/tir')}>
          <Card>
            <Text style={styles.cardTitle}>Tir</Text>
            <Text style={styles.cardText}>
              Travaille la précision et le rythme.
            </Text>
          </Card>
        </Pressable>
        <Pressable onPress={() => router.push('/fundamentals/passe')}>
          <Card>
            <Text style={styles.cardTitle}>Passe</Text>
            <Text style={styles.cardText}>
              Améliore la coordination et la vitesse.
            </Text>
          </Card>
        </Pressable>
        <Pressable onPress={() => router.push('/fundamentals/dribble')}>
          <Card>
            <Text style={styles.cardTitle}>Dribble</Text>
            <Text style={styles.cardText}>
              Renforce le contrôle du ballon.
            </Text>
          </Card>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Button
          label="Historique"
          onPress={() => router.push('/history')}
          variant="secondary"
        />
        <Button
          label="Progression"
          onPress={() => router.push('/progress')}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#4B5563',
  },
  cards: {
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardText: {
    color: '#4B5563',
  },
  actions: {
    gap: 12,
  },
});
