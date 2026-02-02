import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { useSessions } from '../../src/hooks/useSessions';
import { formatDateLabel } from '../../src/utils/format';

const HistoryScreen = () => {
  const { sessions } = useSessions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {sessions.length === 0 ? (
          <Text style={styles.empty}>Aucune session enregistrée.</Text>
        ) : (
          sessions.map((session) => (
            <Link key={session.id} href={`/history/${session.id}`} asChild>
              <Pressable>
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
            </Link>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
