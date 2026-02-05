import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { TextField } from '../../src/components/TextField';
import { useAuth } from '../../src/hooks/useAuth';

const SignupScreen = () => {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    const result = await signUpWithEmail(email.trim(), password);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Créer un compte</Text>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="ton@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextField
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          textContentType="newPassword"
        />
        <TextField
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          secureTextEntry
          textContentType="password"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label="Créer mon compte" onPress={handleSignup} />
      </Card>

      <View style={styles.linkRow}>
        <Text style={styles.linkText}>Déjà inscrit ?</Text>
        <Link href="/(auth)/login" style={styles.linkAction}>
          J’ai déjà un compte
        </Link>
      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
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
  linkRow: {
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    color: '#4B5563',
  },
  linkAction: {
    color: '#111827',
    fontWeight: '600',
  },
});
