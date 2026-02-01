import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export const Card = ({ children }: Props) => {
  return <View style={styles.card}>{children}</View>;
};

type Props = {
  children: ReactNode;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#111827',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    gap: 8,
  },
});
