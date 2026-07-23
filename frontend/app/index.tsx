import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Card from '../src/components/Card';
import PillButton from '../src/components/PillButton';
import { useAppState } from '../src/state/AppState';
import { colors, radii, spacing, typography } from '../src/theme';

export default function OnboardingScreen() {
  const { loading, userName, login } = useAppState();
  const [name, setName] = useState('');

  useEffect(() => {
    if (!loading && userName) {
      router.replace('/(tabs)');
    }
  }, [loading, userName]);

  if (loading || userName) return <View style={styles.container} />;

  const canSubmit = name.trim().length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    await login(name.trim());
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Card style={styles.card}>
        <Text style={styles.title}>Curious Minds</Text>
        <Text style={styles.tagline}>Discover India's greatest scientific minds</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          returnKeyType="go"
          onSubmitEditing={submit}
          autoCapitalize="words"
        />

        <PillButton label="Let's Go" onPress={submit} style={styles.button} />
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.hero,
    color: colors.textPrimary,
  },
  tagline: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    marginBottom: spacing.md,
  },
  button: {
    width: '100%',
  },
});
