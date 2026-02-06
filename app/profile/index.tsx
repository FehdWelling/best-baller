import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { useAuth } from '../../src/hooks/useAuth';
import { getMyProfile } from '../../src/services/profileService';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setUsername(null);
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      try {
        const profile = await getMyProfile(user.id);
        if (!isMounted) {
          return;
        }
        setUsername(profile?.username ?? null);
      } catch {
        if (!isMounted) {
          return;
        }
        setUsername(null);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? 'Non renseigné'}</Text>
        <Text style={styles.label}>Pseudo</Text>
        <Text style={styles.value}>{username ?? 'Non renseigné'}</Text>
        <Button
          label="Modifier pseudo"
          onPress={() => router.push('/(onboarding)/username')}
          variant="secondary"
        />
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
