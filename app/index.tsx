import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BestBaller</Text>
      <Text style={styles.subtitle}>Choisis un fondamental pour démarrer.</Text>

      <View style={styles.cards}>
        <Link href="/fundamentals/tir" asChild>
          <Pressable>
            <Card>
              <Text style={styles.cardTitle}>Tir</Text>
              <Text style={styles.cardText}>
                Travaille la précision et le rythme.
              </Text>
            </Card>
          </Pressable>
        </Link>
        <Link href="/fundamentals/passe" asChild>
          <Pressable>
            <Card>
              <Text style={styles.cardTitle}>Passe</Text>
              <Text style={styles.cardText}>
                Améliore la coordination et la vitesse.
              </Text>
            </Card>
          </Pressable>
        </Link>
        <Link href="/fundamentals/dribble" asChild>
          <Pressable>
            <Card>
              <Text style={styles.cardTitle}>Dribble</Text>
              <Text style={styles.cardText}>
                Renforce le contrôle du ballon.
              </Text>
            </Card>
          </Pressable>
        </Link>
      </View>

      <View style={styles.actions}>
        <Link href="/history" asChild>
          <Button label="Historique" onPress={() => undefined} variant="secondary" />
        </Link>
        <Link href="/progress" asChild>
          <Button label="Progression" onPress={() => undefined} variant="secondary" />
        </Link>
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
