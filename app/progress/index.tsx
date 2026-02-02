import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { useSessions } from '../../src/hooks/useSessions';
import { computeMetrics } from '../../src/utils/metrics';

const ProgressScreen = () => {
  const { sessions } = useSessions();
  const metrics = computeMetrics(sessions);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progression</Text>
      <ScrollView contentContainerStyle={styles.list}>
        <Card>
          <Text style={styles.label}>Sessions sur 7 jours</Text>
          <Text style={styles.value}>{metrics.sessionsLast7Days}</Text>
        </Card>
        <Card>
          <Text style={styles.label}>Volume par fondamental</Text>
          <Text>Tir: {metrics.volumeByFundamental.tir}</Text>
          <Text>Passe: {metrics.volumeByFundamental.passe}</Text>
          <Text>Dribble: {metrics.volumeByFundamental.dribble}</Text>
        </Card>
        <Card>
          <Text style={styles.label}>% réussite moyen par semaine</Text>
          {metrics.weeklySuccessRates.length === 0 ? (
            <Text style={styles.empty}>Aucune donnée de tir.</Text>
          ) : (
            metrics.weeklySuccessRates.map((week) => (
              <Text key={week.weekLabel}>
                {week.weekLabel}: {week.successRate}%
              </Text>
            ))
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

export default ProgressScreen;

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
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
  },
  empty: {
    color: '#6B7280',
  },
});
