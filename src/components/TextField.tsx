import { StyleSheet, Text, TextInput, View } from 'react-native';

export const TextField = ({ label, value, onChangeText, placeholder }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  );
};

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    color: '#374151',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
});
