import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { TextField } from '../../src/components/TextField';
import { useAuth } from '../../src/hooks/useAuth';
import {
  getMyProfile,
  isUsernameAvailable,
  normalizeUsername,
  upsertMyProfile,
  validateUsername,
} from '../../src/services/profileService';

const UsernameOnboardingScreen = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await getMyProfile(user.id);
        setCurrentUsername(profile?.username ?? null);
        if (profile?.username) {
          setUsername(profile.username);
        }
      } catch {
        setError("Impossible de charger ton profil pour l'instant.");
      }
    };

    loadProfile();
  }, [isLoading, user]);

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    setError(null);

    const validation = validateUsername(username);
    if (validation.ok === false) {
      setError(validation.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedUsername = validation.username;
      const normalizedCurrentUsername = currentUsername
        ? normalizeUsername(currentUsername)
        : null;
      const isSameUsername = normalizedCurrentUsername === normalizedUsername;

      if (!isSameUsername) {
        const available = await isUsernameAvailable(normalizedUsername);
        if (!available) {
          setError('Ce pseudo est déjà pris.');
          return;
        }
      }

      await upsertMyProfile(user.id, { username: normalizedUsername });
      router.replace('/');
    } catch {
      setError("Impossible d'enregistrer ton pseudo pour l'instant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Choisis ton pseudo</Text>
        <TextField
          label="Pseudo"
          value={username}
          onChangeText={setUsername}
          placeholder="ex: basketeur123"
          autoCapitalize="none"
          textContentType="username"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          label={isSubmitting ? 'Validation...' : 'Valider'}
          onPress={handleSubmit}
        />
      </Card>
    </View>
  );
};

export default UsernameOnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  error: {
    color: '#B91C1C',
    fontWeight: '600',
  },
});
