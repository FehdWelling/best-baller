import { Stack } from 'expo-router';

const OnboardingLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#F3F4F6' },
        headerTintColor: '#111827',
        headerTitleStyle: { fontWeight: '600' },
        headerTitleAlign: 'center',
      }}
    />
  );
};

export default OnboardingLayout;
