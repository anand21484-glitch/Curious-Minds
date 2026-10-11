import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '../src/theme';

const INFOGRAPHICS: Record<number, ReturnType<typeof require>> = {
  1:  require('../assets/images/experiments/dancing-pepper-infographic.png'),
  2:  require('../assets/images/experiments/walking-water-infographic.png'),
  3:  require('../assets/images/experiments/floating-egg-infographic.png'),
  4:  require('../assets/images/experiments/shadow-detective-infographic.png'),
  5:  require('../assets/images/experiments/rainbow-glass-infographic.png'),
  6:  require('../assets/images/experiments/balloon-static-infographic.png'),
  7:  require('../assets/images/experiments/objects-sink-infographic.png'),
  8:  require('../assets/images/experiments/upside-down-glass-infographic.png'),
  9:  require('../assets/images/experiments/water-filter-infographic.png'),
  10: require('../assets/images/experiments/lava-lamp-infographic.png'),
  11: require('../assets/images/experiments/balloon-car-infographic.png'),
  12: require('../assets/images/experiments/paper-bridge-infographic.png'),
  13: require('../assets/images/experiments/sundial-infographic.png'),
  14: require('../assets/images/experiments/balloon-lung-infographic.png'),
  15: require('../assets/images/experiments/compass-infographic.png'),
  16: require('../assets/images/experiments/paper-plane-infographic.png'),
  17: require('../assets/images/experiments/egg-drop-infographic.png'),
  18: require('../assets/images/experiments/rain-gauge-infographic.png'),
  19: require('../assets/images/experiments/soil-detective-infographic.png'),
  20: require('../assets/images/experiments/seed-germination-infographic.png'),
  21: require('../assets/images/experiments/electromagnet-infographic.png'),
  22: require('../assets/images/experiments/heat-insulation-infographic.png'),
  23: require('../assets/images/experiments/mini-ecosystem-infographic.png'),
  24: require('../assets/images/experiments/crater-infographic.png'),
  25: require('../assets/images/experiments/solar-oven-infographic.png'),
};

export default function ExperimentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const experimentId = Number(id) || 1;
  const source = INFOGRAPHICS[experimentId] ?? INFOGRAPHICS[1];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back to Experiments</Text>
        </TouchableOpacity>

        <Image source={source} style={styles.infographic} resizeMode="contain" />

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
  backBtn: {
    padding: 16,
    paddingBottom: 8,
  },
  backText: {
    color: '#A78BFA',
    fontSize: 16,
    fontFamily: typography.fontFamily.headingBold,
  },
  infographic: {
    width: '100%',
    height: undefined,
    aspectRatio: 9 / 16,
  },
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