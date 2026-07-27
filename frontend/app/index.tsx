import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.brainCircle}>
          <Text style={styles.brainEmoji}>🧠</Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Curious Minds</Text>
          <Text style={styles.tagline}>Discover India's greatest scientists</Text>
        </View>

        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>What's your name?</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Type your name"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            returnKeyType="go"
            onSubmitEditing={submit}
            autoCapitalize="words"
            maxLength={20}
          />
        </View>

        <PillButton label="Let's Go →" onPress={submit} style={styles.button} />
        <Text style={styles.hint}>Press Enter or tap "Let's Go" to start exploring</Text>

        <Pressable onPress={() => router.push('/parents')} style={styles.parentsLink}>
          <Text style={styles.parentsLinkText}>Message for Parents</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.xl,
  },
  brainCircle: {
    width: 140,
    height: 140,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainEmoji: {
    fontSize: 64,
  },
  titleBlock: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.hero,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  tagline: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  inputBlock: {
    width: '100%',
    maxWidth: 360,
    gap: spacing.sm,
  },
  inputLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: typography.microLabelLetterSpacing,
  },
  input: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.cardTitleSm + 1,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 360,
  },
  hint: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.microLabel,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: -spacing.md,
  },
  parentsLink: {
    marginTop: spacing.md,
  },
  parentsLinkText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
