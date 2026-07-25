// Design tokens extracted directly from design/Curious Minds.dc.html (the primary
// design source — inline styles + the DCLogic class's computed color formulas).

export const colors = {
  background: '#0F0B2E',
  surface: '#1B1547',

  // Named gradients exactly as used per-card in the design (angle 135deg throughout).
  heroGradient: ['#2C2270', '#150F3E'] as const, // hero/mission cards, quiz-hub XP bar
  greetingGradient: ['#1B1547', '#2C2270'] as const, // home greeting/mission card
  storyGradient: ['#241C5C', '#150F3E'] as const, // story-of-the-day card
  discoveryGradient: ['#1B1547', '#241C5C'] as const, // daily discovery card
  goldIconGradient: ['#E7B93C', '#C99420'] as const, // CM logo mark, quiz result badge

  gold: '#E7B93C',
  goldText: '#F3D783',
  onGold: '#20170A',
  onSoft: '#1A1420', // dark text used on solid-color badges (e.g. featured avatar)

  purple: '#8B7BFF',
  purpleGradient: ['#3A1E5C', '#1B1547'] as const,
  purpleBorder: 'rgba(139,123,255,0.35)',
  parentsGradient: ['#150F3E', '#5B2E8F'] as const,

  success: '#2FD9A0',
  error: '#FF5C8A', // Think Fast wrong-answer only
  errorAlt: '#E1556B', // regular Quiz wrong-answer
  blue: '#4EA8FF',
  orange: '#FF9F45',

  textPrimary: '#F6F4FF',
  textSecondary: '#9187C4',
  textMuted: '#6C6591',
  textOnDark: '#D8D3F2',
  textTertiary: '#8078B0', // list metadata / counts / chevrons

  hairline: 'rgba(255,255,255,0.06)',
  hairlineStrong: 'rgba(255,255,255,0.08)',
  inputBorder: 'rgba(255,255,255,0.1)',
  backCircle: 'rgba(255,255,255,0.06)',
} as const;

// Explore taxonomy + scientist-field accent colors (id, display name, 2-letter badge, color)
export const fields = [
  { id: 'math', name: 'Mathematics', mono: 'Ma', color: '#FF5C8A', rgb: '255,92,138' },
  { id: 'physics', name: 'Physics', mono: 'Ph', color: '#4EA8FF', rgb: '78,168,255' },
  { id: 'space', name: 'Space Science', mono: 'Sp', color: '#8B7BFF', rgb: '139,123,255' },
  { id: 'medicine', name: 'Medicine', mono: 'Me', color: '#2FD9A0', rgb: '47,217,160' },
  { id: 'life', name: 'Life Sciences', mono: 'Li', color: '#FF9F45', rgb: '255,159,69' },
  { id: 'engineering', name: 'Engineering', mono: 'En', color: '#4AE0D8', rgb: '74,224,216' },
  { id: 'chemistry', name: 'Chemistry', mono: 'Ch', color: '#FFD23C', rgb: '255,210,60' },
  { id: 'biotechnology', name: 'Biotechnology', mono: 'Bi', color: '#C264E0', rgb: '194,100,224' },
  { id: 'pharma', name: 'Pharmaceutical Science', mono: 'Pha', color: '#E068C4', rgb: '224,104,196' },
  { id: 'environment', name: 'Environmental Science', mono: 'Ev', color: '#A7E048', rgb: '167,224,72' },
  { id: 'agriculture', name: 'Agriculture', mono: 'Ag', color: '#5CC97A', rgb: '92,201,122' },
  { id: 'marine', name: 'Marine Science', mono: 'Mr', color: '#1FB8D6', rgb: '31,184,214' },
  { id: 'ancient', name: 'Ancient Indian Scientists', mono: 'An', color: '#F2B84B', rgb: '242,184,75' },
  { id: 'nobel', name: 'Nobel Laureates', mono: 'Nb', color: '#7CD9FF', rgb: '124,217,255' },
] as const;

// Decorative emoji per field, used by Think Fast Challenge (the design uses
// actual emoji here, not the mono badge).
export const fieldEmoji: Record<string, string> = {
  math: '🔢',
  physics: '⚛️',
  space: '🚀',
  medicine: '🩺',
  life: '🌿',
  engineering: '⚙️',
  chemistry: '⚗️',
  biotechnology: '🧬',
  pharma: '💊',
  environment: '🌍',
  agriculture: '🌾',
  marine: '🌊',
  ancient: '🏛️',
  nobel: '🏆',
};

// Soft (tinted) badge background at the exact design opacities: 0.18 for
// Explore/field-list rows, 0.16 for the Profile hero, 0.25 for Home's decorative circle.
export function softColor(rgb: string, opacity: number = 0.18): string {
  return `rgba(${rgb},${opacity})`;
}

// Bottom tab bar: each tab's active tint; inactive tabs share one muted tone.
export const tabBar = {
  inactive: '#8078B0',
  home: '#FF5C8A',
  explore: '#4EA8FF',
  quiz: '#8B7BFF',
  rank: '#2FD9A0',
} as const;

// Font families assume @expo-google-fonts/poppins + @expo-google-fonts/inter are installed and loaded via useFonts.
export const typography = {
  fontFamily: {
    headingRegular: 'Poppins_700Bold',
    headingBold: 'Poppins_800ExtraBold',
    bodyRegular: 'Inter_500Medium',
    bodySemiBold: 'Inter_600SemiBold',
    bodyBold: 'Inter_700Bold',
  },
  size: {
    hero: 26,
    sectionTitle: 20,
    headerLg: 18, // "Explore Fields", "Quiz Zone" header titles
    headerMd: 17, // "Hi, {name}", field/profile header titles
    headerSm: 16, // "The Curiosity Dashboard" (long title)
    headerXs: 15, // header titles that share space with progress text
    cardTitle: 16,
    cardTitleSm: 14,
    body: 14,
    bodySmall: 13,
    micro: 12,
    microLabel: 11,
    statSmall: 22,
    statMed: 24,
    statLarge: 40,
  },
  microLabelLetterSpacing: 0.8,
} as const;

export const radii = {
  pill: 100,
  cardHero: 20, // hero/panel cards (mission, story, dashboard level/CQ cards)
  card: 16, // standard stat/list-container cards
  cardSmall: 14, // list rows, small stat cards
  cardTiny: 12, // chips, badge grid items, quiz theme icon squares
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 14,
  lg: 18, // screen content padding in the design (not 20)
  xl: 22, // gap between stacked home sections
} as const;

export const theme = { colors, fields, tabBar, typography, radii, spacing, softColor } as const;

export type Theme = typeof theme;
export default theme;
