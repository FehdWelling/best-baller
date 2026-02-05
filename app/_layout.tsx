import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../src/hooks/useAuth';
import { sessionStore } from '../src/services/sessionStore';

const RootLayout = () => {
  const { session, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    sessionStore.setSyncUser(user?.id ?? null);

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (session && inAuthGroup) {
      router.replace('/');
    }
  }, [segments, session, user, isLoading, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#F3F4F6' },
        headerTintColor: '#111827',
        headerTitleStyle: { fontWeight: '600' },
      }}
    />
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
});
