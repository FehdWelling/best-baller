import { Pressable, StyleSheet, Text } from 'react-native';

export const Button = ({ label, onPress, variant = 'primary' }: Props) => {
  const isSecondary = variant === 'secondary';
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, isSecondary ? styles.secondary : styles.primary]}
    >
      <Text style={[styles.label, isSecondary ? styles.labelSecondary : null]}>
        {label}
      </Text>
    </Pressable>
  );
};

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#111827',
  },
  secondary: {
    backgroundColor: '#E5E7EB',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  labelSecondary: {
    color: '#111827',
  },
});
