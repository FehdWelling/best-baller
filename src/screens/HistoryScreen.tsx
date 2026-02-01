import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { useSessions } from '../hooks/useSessions';
import { formatDateLabel } from '../utils/format';

export const HistoryScreen = () => {
  const { sessions } = useSessions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {sessions.length === 0 ? (
          <Text style={styles.empty}>Aucune session enregistrée.</Text>
        ) : (
          sessions.map((session) => (
            <Card key={session.id}>
              <Text style={styles.name}>{formatDateLabel(session.date)}</Text>
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
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
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
