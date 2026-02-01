import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Fundamental } from '../models/types';

export const HomeScreen = ({ onSelectFundamental }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BestBaller</Text>
      <Text style={styles.subtitle}>Choisis un fondamental pour démarrer.</Text>
      <View style={styles.grid}>
        <Button
          label="Tir"
          onPress={() => onSelectFundamental('tir')}
        />
        <Button
          label="Passe"
          onPress={() => onSelectFundamental('passe')}
        />
        <Button
          label="Dribble"
          onPress={() => onSelectFundamental('dribble')}
        />
      </View>
    </View>
  );
};

type Props = {
  onSelectFundamental: (value: Fundamental) => void;
};

const styles = StyleSheet.create({
  container: {
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
  grid: {
    gap: 12,
  },
});
