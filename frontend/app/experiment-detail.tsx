import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '../src/theme';

const EXPERIMENT_1 = {
  id: 1,
  emoji: '🌶️',
  title: 'The Dancing Pepper',
  tagline: 'Watch pepper run away from soap!',
  headerColor: '#1A0A3E',
  accentColor: '#7C3AED',
  difficulty: 'Easy',
  duration: '10-15 mins',
  ageGroup: '6-12 years',
  materials: [
    { emoji: '🍽️', name: 'Plate' },
    { emoji: '💧', name: 'Water' },
    { emoji: '🌶️', name: 'Black Pepper' },
    { emoji: '🫧', name: 'Dish Soap' },
    { emoji: '🩺', name: 'Cotton Bud' },
  ],
  steps: [
    { number: 1, icon: '🍽️', text: 'Fill a plate with water and let it settle completely.' },
    { number: 2, icon: '🌶️', text: 'Sprinkle black pepper evenly over the surface of the water.' },
    { number: 3, icon: '👀', text: 'Observe the pepper floating on the surface.' },
    { number: 4, icon: '🫧', text: 'Dip a cotton bud into dish soap.' },
    { number: 5, icon: '👆', text: 'Gently touch the centre of the water surface with the soapy cotton bud.' },
    { number: 6, icon: '✨', text: 'Watch the pepper race to the edges of the plate!' },
  ],
  whatHappens:
    'Water molecules hold together very strongly — this is called surface tension. Dish soap breaks this tension in the centre, causing the water to pull away towards the edges and taking the pepper with it!',
  scientist: {
    name: 'Agnes Pockels',
    years: '1862-1935',
    fact: 'Agnes Pockels was a self-taught German scientist who discovered how soap and oils affect water surface tension — from her own kitchen sink!',
    emoji: '🔬',
  },
  concept: 'Surface Tension',
  safety: null as string | null,
};

export default function ExperimentDetailScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: EXPERIMENT_1.headerColor }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerEmoji}>{EXPERIMENT_1.emoji}</Text>
          <Text style={styles.headerTitle}>{EXPERIMENT_1.title}</Text>
          <Text style={styles.headerTagline}>{EXPERIMENT_1.tagline}</Text>
          <View style={styles.headerTags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>⚡ {EXPERIMENT_1.difficulty}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>⏱ {EXPERIMENT_1.duration}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>👶 {EXPERIMENT_1.ageGroup}</Text>
            </View>
          </View>
        </View>

        {/* Materials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 What You Need</Text>
          <View style={styles.materialsGrid}>
            {EXPERIMENT_1.materials.map((mat, i) => (
              <View key={i} style={styles.materialChip}>
                <Text style={styles.materialEmoji}>{mat.emoji}</Text>
                <Text style={styles.materialName}>{mat.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Steps</Text>
          {EXPERIMENT_1.steps.map((step) => (
            <View key={step.number} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.number}</Text>
              </View>
              <Text style={styles.stepIcon}>{step.icon}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        {/* What Happens */}
        <View style={[styles.section, styles.whatHappensSection]}>
          <Text style={styles.sectionTitle}>💡 What Happens & Why?</Text>
          <Text style={styles.whatHappensText}>{EXPERIMENT_1.whatHappens}</Text>
          <View style={styles.conceptBadge}>
            <Text style={styles.conceptText}>🔬 Concept: {EXPERIMENT_1.concept}</Text>
          </View>
        </View>

        {/* Scientist */}
        <View style={[styles.section, styles.scientistSection]}>
          <Text style={styles.sectionTitle}>👩‍🔬 Meet the Scientist</Text>
          <View style={styles.scientistCard}>
            <Text style={styles.scientistEmoji}>{EXPERIMENT_1.scientist.emoji}</Text>
            <View style={styles.scientistInfo}>
              <Text style={styles.scientistName}>{EXPERIMENT_1.scientist.name}</Text>
              <Text style={styles.scientistYears}>{EXPERIMENT_1.scientist.years}</Text>
              <Text style={styles.scientistFact}>{EXPERIMENT_1.scientist.fact}</Text>
            </View>
          </View>
        </View>

        {/* Safety if needed */}
        {EXPERIMENT_1.safety && (
          <View style={styles.safetySection}>
            <Text style={styles.safetyText}>{EXPERIMENT_1.safety}</Text>
          </View>
        )}

        {/* Try it button */}
        <TouchableOpacity style={styles.tryButton} onPress={() => router.back()}>
          <Text style={styles.tryButtonText}>✅ I tried this experiment!</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D0D1A' },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  // Header
  header: {
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 12 },
  backText: { color: '#A78BFA', fontSize: 16, fontFamily: typography.fontFamily.headingBold },
  headerEmoji: { fontSize: 64, marginBottom: 8 },
  headerTitle: {
    fontSize: 26,
    fontFamily: typography.fontFamily.headingBold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  headerTagline: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bodyRegular,
    color: '#C4B5FD',
    textAlign: 'center',
    marginBottom: 16,
  },
  headerTags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  tag: {
    backgroundColor: 'rgba(124,58,237,0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  tagText: { color: '#A78BFA', fontSize: 12, fontFamily: typography.fontFamily.headingBold },

  // Sections
  section: {
    margin: 16,
    backgroundColor: '#1A0A3E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D1B69',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.headingBold,
    color: '#FFFFFF',
    marginBottom: 12,
  },

  // Materials
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  materialChip: {
    backgroundColor: '#2D1B69',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  materialEmoji: { fontSize: 24, marginBottom: 4 },
  materialName: {
    fontSize: 11,
    fontFamily: typography.fontFamily.bodyRegular,
    color: '#C4B5FD',
    textAlign: 'center',
  },

  // Steps
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: typography.fontFamily.headingBold,
  },
  stepIcon: { fontSize: 20, flexShrink: 0 },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fontFamily.bodyRegular,
    color: '#E2D9F3',
    lineHeight: 20,
  },

  // What happens
  whatHappensSection: { backgroundColor: '#0A1628' },
  whatHappensText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bodyRegular,
    color: '#E2D9F3',
    lineHeight: 22,
    marginBottom: 12,
  },
  conceptBadge: {
    backgroundColor: '#1E3A5F',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#60A5FA',
  },
  conceptText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.headingBold,
    color: '#93C5FD',
  },

  // Scientist
  scientistSection: { backgroundColor: '#0A1A0A' },
  scientistCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  scientistEmoji: { fontSize: 44 },
  scientistInfo: { flex: 1 },
  scientistName: {
    fontSize: 16,
    fontFamily: typography.fontFamily.headingBold,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  scientistYears: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bodyRegular,
    color: '#86EFAC',
    marginBottom: 6,
  },
  scientistFact: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bodyRegular,
    color: '#D1FAE5',
    lineHeight: 19,
  },

  // Safety
  safetySection: {
    margin: 16,
    backgroundColor: '#2D1500',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  safetyText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.headingBold,
    color: '#FCD34D',
  },

  // Try button
  tryButton: {
    margin: 16,
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  tryButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.headingBold,
    color: '#FFFFFF',
  },
});
