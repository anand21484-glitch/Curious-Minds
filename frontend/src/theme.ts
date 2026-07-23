// Design tokens extracted from design/README.md and design/Curious Minds.dc.html

export const colors = {
  background: '#0F0B2E',
  surface: '#1B1547',
  surfaceGradient: ['#2C2270', '#150F3E'] as const,

  gold: '#E7B93C',
  goldText: '#F3D783',
  onGold: '#20170A',

  purple: '#8B7BFF',
  purpleGradient: ['#3A1E5C', '#1B1547'] as const,
  purpleBorder: 'rgba(139,123,255,0.35)',
  parentsGradient: ['#150F3E', '#5B2E8F'] as const,

  success: '#2FD9A0',
  error: '#FF5C8A',
  errorAlt: '#E1556B',

  textPrimary: '#F6F4FF',
  textSecondary: '#9187C4',
  textMuted: '#6C6591',
  textOnDark: '#D8D3F2',

  hairline: 'rgba(255,255,255,0.08)',
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

// Bottom tab bar: each tab's active tint; inactive tabs share one muted tone.
export const tabBar = {
  inactive: '#8078B0',
  home: '#FF5C8A',
  explore: '#4EA8FF',
  quiz: '#8B7BFF',
  rank: '#2FD9A0',
  stories: '#FF9F45',
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
    cardTitle: 16,
    body: 14,
    bodySmall: 12,
    microLabel: 11,
    statSmall: 22,
    statLarge: 40,
  },
  microLabelLetterSpacing: 0.7,
} as const;

export const radii = {
  pill: 100,
  card: 18,
  cardSmall: 14,
  cardLarge: 24,
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 14,
  lg: 20,
  xl: 22,
} as const;

export const theme = { colors, fields, tabBar, typography, radii, spacing } as const;

export type Theme = typeof theme;
export default theme;
