import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../src/components/Card';
import ScreenHeader from '../src/components/ScreenHeader';
import { colors, radii, spacing, typography } from '../src/theme';

function Eyebrow({ color, children }: { color: string; children: string }) {
  return <Text style={[styles.eyebrow, { color }]}>{children}</Text>;
}

export default function MissionScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Our Mission" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={[styles.heroCard, { borderColor: 'rgba(231,185,60,0.3)' }]}>
          <Eyebrow color={colors.gold}>🌍 Why Scientists Matter</Eyebrow>
          <Text style={styles.body}>
            Look around you. The light that brightens your room, the medicine that helps you
            recover, the food on your plate, the weather forecast on your phone, the satellite
            guiding an airplane, the clean water you drink, the internet connecting people across
            the world — none of these appeared by magic.
            {'\n\n'}
            They exist because, somewhere, someone was curious enough to ask a simple question:
            "Why?" And brave enough to spend years searching for the answer.
            {'\n\n'}
            Scientists are explorers. They don't explore hidden treasure. They explore hidden
            truths. They observe carefully, ask questions fearlessly, test their ideas, learn from
            mistakes, and when new evidence appears, they are willing to change their minds. That
            is what makes science powerful.
            {'\n\n'}
            Every scientific discovery — a life-saving medicine, a rocket reaching space, a
            stronger crop for farmers, a cleaner source of energy — begins with curiosity and
            careful observation.
            {'\n\n'}
            Because of scientists, children survive diseases that once took millions of lives.
            Farmers grow more food. Families stay safer during storms. Spacecraft explore distant
            worlds. Technology connects billions of people. Scientists don't just invent things —
            they build a better tomorrow.
          </Text>
        </Card>

        <View style={styles.section}>
          <Eyebrow color={colors.blue}>🧠 Think Like a Scientist</Eyebrow>
          <Card style={styles.plainCard}>
            <Text style={styles.body}>
              A scientific mind does not accept something simply because someone famous said it,
              everyone believes it, it has been repeated many times, or it sounds convincing.
              {'\n\n'}
              Instead, a scientist asks:
              {'\n'}🔍 What is the evidence?
              {'\n'}🧪 Can this be tested?
              {'\n'}👀 What do careful observations show?
              {'\n'}🤔 Are there other explanations?
              {'\n\n'}
              Science teaches us that asking questions is not disrespectful — it is the first step
              toward understanding. The greatest scientists in history were once curious children
              who refused to stop asking "Why?"
            </Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Eyebrow color={colors.success}>🌱 Your Journey Begins Here</Eyebrow>
          <Card style={styles.plainCard}>
            <Text style={styles.body}>
              You don't need a laboratory to become a scientist. You only need:
              {'\n'}✨ Curiosity to ask questions.
              {'\n'}👀 Sharp eyes to observe.
              {'\n'}🧠 Logic to think clearly.
              {'\n'}💙 Courage to admit when you're wrong.
              {'\n'}🤝 Respect for evidence, even when it changes your opinion.
              {'\n\n'}
              Every question you ask, every experiment you try, every mistake you learn from makes
              you a better thinker. And better thinkers build better families, better communities,
              a stronger nation, and a brighter future for everyone.
            </Text>
          </Card>
        </View>

        <Card style={[styles.heroCard, styles.promiseCard]}>
          <Eyebrow color={colors.gold}>⭐ The Curious Minds Promise</Eyebrow>
          <Text style={styles.promiseText}>
            I will stay curious.{'\n'}I will ask respectful questions.{'\n'}I will seek evidence
            before accepting claims.{'\n'}I will learn from my mistakes.{'\n'}I will keep an open
            mind.{'\n'}I will use knowledge to help others.
          </Text>
        </Card>

        <View style={styles.mottoBlock}>
          <Eyebrow color={colors.textSecondary}>🌟 Our Motto</Eyebrow>
          <Text style={styles.motto}>
            "Curiosity Lights the Mind. Science Lights the World."
          </Text>
        </View>

        <View style={styles.section}>
          <Eyebrow color={colors.orange}>🌟 Our Philosophy</Eyebrow>
          <Card style={styles.plainCard}>
            <Text style={styles.body}>
              Heroes don't all wear uniforms or capes. Some fought for our freedom. Some expanded
              our knowledge. Some healed the sick, fed the hungry, explored space, and protected
              our planet. They all had one thing in common: they chose to make the world better
              than they found it.
              {'\n\n'}
              Now it's your turn. Stay curious. Ask questions. Think critically. Build with
              kindness. And never stop learning.
            </Text>
          </Card>
        </View>

        <View style={styles.finalWords}>
          <Eyebrow color={colors.textSecondary}>🌟 Final Words</Eyebrow>
          <Text style={styles.finalWordsText}>
            The next great discovery isn't waiting in a laboratory. It might be waiting in your
            next question.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  heroCard: {
    borderRadius: radii.cardHero,
    borderWidth: 1,
  },
  promiseCard: {
    backgroundColor: 'rgba(231,185,60,0.1)',
    borderColor: 'rgba(231,185,60,0.35)',
  },
  plainCard: {
    marginTop: spacing.sm,
  },
  section: {},
  eyebrow: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    textTransform: 'uppercase',
    letterSpacing: typography.microLabelLetterSpacing,
  },
  body: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textOnDark,
    lineHeight: 24,
    marginTop: spacing.xs,
  },
  promiseText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textPrimary,
    lineHeight: 27,
    marginTop: spacing.sm,
  },
  mottoBlock: {
    alignItems: 'center',
    gap: 6,
  },
  motto: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.cardTitle,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
  },
  finalWords: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.md,
  },
  finalWordsText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.cardTitle,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
