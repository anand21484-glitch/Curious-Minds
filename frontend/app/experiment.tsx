import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '../src/components/ScreenHeader';
import { colors, spacing, typography } from '../src/theme';

const EXPERIMENTS = [
  {
    id: 1,
    title: 'The Dancing Pepper',
    description:
      'Sprinkle black pepper on water and touch the surface with dish soap. Watch the pepper quickly move away!',
    materials: ['Plate', 'Water', 'Black pepper', 'Dishwashing liquid', 'Cotton bud'],
    difficulty: 'Easy',
    duration: '10-15 mins',
    scientist: 'Agnes Pockels',
    concept: 'Surface Tension',
    emoji: '🌶️',
    safety: null as string | null,
  },
  {
    id: 2,
    title: 'Walking Water',
    description:
      'Place coloured water in two glasses connected to an empty glass using folded paper towels. Watch water travel through paper!',
    materials: ['3 glasses', 'Water', 'Food colouring', 'Paper towels'],
    difficulty: 'Easy',
    duration: '15-20 mins',
    scientist: 'Thomas Young',
    concept: 'Capillary Action',
    emoji: '💧',
    safety: null as string | null,
  },
  {
    id: 3,
    title: 'The Floating Egg',
    description:
      'Place an egg in plain water then gradually add salt. Watch how increasing density makes the egg float!',
    materials: ['Egg', '2 glasses', 'Water', 'Salt', 'Spoon'],
    difficulty: 'Easy',
    duration: '10-15 mins',
    scientist: 'Archimedes',
    concept: 'Density & Buoyancy',
    emoji: '🥚',
    safety: null as string | null,
  },
  {
    id: 4,
    title: 'Shadow Detective',
    description:
      'Place an object in front of a torch and observe how its shadow changes when the torch moves closer or farther away.',
    materials: ['Torch', 'Toy/object', 'Wall', 'Paper', 'Pencil'],
    difficulty: 'Easy',
    duration: '10-15 mins',
    scientist: 'Ibn al-Haytham (Alhazen)',
    concept: 'Light Travels in Straight Lines',
    emoji: '🔦',
    safety: null as string | null,
  },
  {
    id: 5,
    title: 'Rainbow in a Glass',
    description:
      'Use a glass of water and sunlight to create a small spectrum and discover how white light separates into different colours!',
    materials: ['Clear glass', 'Water', 'White paper', 'Sunlight'],
    difficulty: 'Easy',
    duration: '10-15 mins',
    scientist: 'Isaac Newton',
    concept: 'Refraction & Dispersion of Light',
    emoji: '🌈',
    safety: null as string | null,
  },
  {
    id: 6,
    title: 'Balloon Static Power',
    description:
      'Rub a balloon against wool or dry hair and bring it near small pieces of paper. Watch the paper get attracted to the balloon!',
    materials: ['Balloon', 'Woollen cloth or dry hair', 'Small pieces of paper'],
    difficulty: 'Easy',
    duration: '10-15 mins',
    scientist: 'Benjamin Franklin',
    concept: 'Static Electricity',
    emoji: '🎈',
    safety: null as string | null,
  },
  {
    id: 7,
    title: 'Which Objects Sink?',
    description:
      'Collect safe household objects, predict whether each will sink or float, then test your predictions in water!',
    materials: [
      'Bowl of water',
      'Pencil',
      'Spoon',
      'Coin',
      'Bottle cap',
      'Stone',
      'Other safe household objects',
    ],
    difficulty: 'Easy',
    duration: '15-20 mins',
    scientist: 'Archimedes',
    concept: 'Density & Buoyancy',
    emoji: '🪨',
    safety: null as string | null,
  },
  {
    id: 8,
    title: 'The Upside-Down Water Glass',
    description:
      'Fill a glass with water, cover with a stiff card and carefully turn it upside down. Watch atmospheric pressure support the card!',
    materials: ['Glass', 'Water', 'Stiff card'],
    difficulty: 'Easy',
    duration: '10-15 mins',
    scientist: 'Evangelista Torricelli',
    concept: 'Atmospheric Pressure',
    emoji: '🥛',
    safety: '⚠️ Perform over a sink or tray with adult supervision.' as string | null,
  },
  // Keep experiments 9-25 as placeholders
  ...Array.from({ length: 17 }, (_, i) => ({
    id: i + 9,
    title: `Experiment ${i + 9}`,
    description: 'Coming soon...',
    materials: [] as string[],
    difficulty: i < 8 ? 'Medium' : 'Hard',
    duration: '15-20 mins',
    scientist: '',
    concept: '',
    emoji: '🧪',
    safety: null as string | null,
  })),
];

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
            style={[styles.experimentCard, exp.description === 'Coming soon...' && styles.comingSoonCard]}
            onPress={() => {
              if (exp.description === 'Coming soon...') {
                Alert.alert('🧪 Coming Soon!', 'This experiment is coming soon!');
                return;
              }
              Alert.alert(
                `${exp.emoji} ${exp.title}`,
                `📚 Concept: ${exp.concept}\n\n🔬 Scientist: ${exp.scientist}\n\n🛒 Materials:\n${exp.materials
                  .map((m) => `• ${m}`)
                  .join('\n')}${exp.safety ? `\n\n${exp.safety}` : ''}`,
                [{ text: 'Got it! 🔬', style: 'default' }],
              );
            }}
          >
            <View style={styles.numberCircle}>
              <Text style={styles.emojiText}>{exp.emoji}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.experimentTitle}>{exp.title}</Text>
              <Text style={styles.experimentDesc} numberOfLines={2}>
                {exp.description}
              </Text>
              {exp.concept ? <Text style={styles.conceptText}>💡 {exp.concept}</Text> : null}
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
  comingSoonCard: {
    opacity: 0.5,
  },
  numberCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 22,
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
  conceptText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.bodyRegular,
    color: '#A78BFA',
    marginTop: 2,
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
