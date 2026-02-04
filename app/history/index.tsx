import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { useSessions } from '../../src/hooks/useSessions';
import { formatDateLabel } from '../../src/utils/format';

const HistoryScreen = () => {
  const router = useRouter();
  const { sessions, isHydrated } = useSessions();

  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <Text>Chargement…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {sessions.length === 0 ? (
          <Text style={styles.empty}>Aucune session enregistrée.</Text>
        ) : (
          sessions.map((session) => (
            <Pressable
              key={session.id}
              onPress={() => router.push(`/history/${session.id}`)}
            >
              <Card>
                <Text style={styles.name}>{formatDateLabel(session.date)}</Text>
                <Text>Fondamental: {session.fundamental}</Text>
                <Text>
                  {session.type === 'timer'
                    ? `Durée: ${session.durationSec ?? 0} sec`
                    : `Répétitions: ${session.reps ?? 0}`}
                </Text>
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  list: {
    gap: 12,
  },
  name: {
    fontWeight: '600',
  },
  empty: {
    color: '#6B7280',
  },
});
