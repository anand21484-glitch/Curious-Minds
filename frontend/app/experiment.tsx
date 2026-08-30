import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '../src/components/ScreenHeader';
import { colors, spacing, typography } from '../src/theme';

const EXPERIMENTS = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `Experiment ${i + 1}`,
  description: 'Coming soon...',
  emoji: '🧪',
  difficulty: i < 8 ? 'Easy' : i < 17 ? 'Medium' : 'Hard',
  duration: '15-20 mins',
}));

export default function ExperimentExplorerScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="🧪 Experiment Explorer" onBack={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.tagline}>Hands-On Challenges for Curious Minds</Text>
        <Text style={styles.subtitle}>25 experiments • Science in action!</Text>

        {EXPERIMENTS.map((exp) => (
          <Pressable
            key={exp.id}
            style={styles.experimentCard}
            onPress={() =>
              Alert.alert(`🧪 ${exp.title}`, 'This experiment is coming soon! Stay curious!', [
                { text: "Can't Wait! 🔬", style: 'default' },
              ])
            }
          >
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{exp.id}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.experimentTitle}>{exp.title}</Text>
              <Text style={styles.experimentDesc}>{exp.description}</Text>
              <View style={styles.tagRow}>
                <View style={styles.difficultyTag}>
                  <Text style={styles.tagText}>{exp.difficulty}</Text>
                </View>
                <View style={styles.durationTag}>
                  <Text style={styles.tagText}>⏱ {exp.duration}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 40 },
  tagline: {
    fontSize: 16,
    fontFamily: typography.fontFamily.headingBold,
    color: '#7C3AED',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bodyRegular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  experimentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A0A3E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#7C3AED',
    gap: 12,
  },
  numberCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.headingBold,
    color: '#FFFFFF',
  },
  cardContent: { flex: 1, gap: 4 },
  experimentTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.headingBold,
    color: '#FFFFFF',
  },
  experimentDesc: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bodyRegular,
    color: '#C4B5FD',
  },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  difficultyTag: {
    backgroundColor: '#2D1B69',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  durationTag: {
    backgroundColor: '#2D1B69',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bodyRegular,
    color: '#A78BFA',
  },
  chevron: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bodyBold,
    color: '#7C3AED',
  },
});
