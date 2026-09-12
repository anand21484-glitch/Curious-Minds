import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '../src/theme';

const DANCING_PEPPER_INFOGRAPHIC = require('../assets/images/experiments/dancing-pepper-infographic.png');

export default function ExperimentDetailScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back to Experiments</Text>
        </TouchableOpacity>

        {/* Infographic Image */}
        <Image source={DANCING_PEPPER_INFOGRAPHIC} style={styles.infographic} resizeMode="contain" />

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
