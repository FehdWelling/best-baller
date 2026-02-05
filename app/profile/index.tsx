import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { useAuth } from '../../src/hooks/useAuth';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? 'Non renseigné'}</Text>
        <Button label="Se déconnecter" onPress={signOut} variant="secondary" />
      </Card>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  label: {
    color: '#6B7280',
    fontWeight: '600',
  },
  value: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
});
