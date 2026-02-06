import { useEffect, useMemo, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../src/hooks/useAuth';
import { getMyProfile } from '../src/services/profileService';

type ProfileState = {
  username: string | null;
};

const RootLayout = () => {
  const { session, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      setIsProfileLoading(true);
      try {
        const nextProfile = await getMyProfile(user.id);
        if (!isMounted) {
          return;
        }
        setProfile({ username: nextProfile?.username ?? null });
      } catch {
        if (!isMounted) {
          return;
        }
        setProfile(null);
      } finally {
        if (isMounted) {
          setIsProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [isLoading, user]);

  const needsUsername = useMemo(() => {
    if (!session) {
      return false;
    }

    return !profile?.username;
  }, [profile, session]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (session && isProfileLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (!session) {
      return;
    }

    if (needsUsername && !inOnboardingGroup) {
      router.replace('/(onboarding)/username');
      return;
    }

    if (!needsUsername && (inAuthGroup || inOnboardingGroup)) {
      router.replace('/');
    }
  }, [segments, session, isLoading, isProfileLoading, needsUsername, router]);

  if (isLoading || (session && isProfileLoading)) {
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
