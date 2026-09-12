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
  {
    id: 9,
    title: 'Build Your Own Water Filter',
    description:
      'Build a simple layered filter using cotton, sand and gravel and pour muddy water through it to observe how different materials trap particles.',
    materials: ['Plastic bottle', 'Cotton', 'Clean sand', 'Gravel', 'Container', 'Muddy water'],
    difficulty: 'Medium',
    duration: '20-25 mins',
    scientist: 'John Snow',
    concept: 'Filtration & Separation of Mixtures',
    emoji: '🚰',
    safety: '⚠️ Filtered water must not be consumed.' as string | null,
  },
  {
    id: 10,
    title: 'Homemade Lava Lamp',
    description:
      'Combine oil, water and food colouring and add an effervescent tablet to create colourful bubbles moving up and down.',
    materials: ['Clear bottle/glass', 'Cooking oil', 'Water', 'Food colouring', 'Effervescent tablet'],
    difficulty: 'Easy',
    duration: '15-20 mins',
    scientist: 'Archimedes',
    concept: 'Density, Immiscible Liquids & Gas Bubbles',
    emoji: '🌋',
    safety: null as string | null,
  },
  {
    id: 11,
    title: 'Balloon-Powered Car',
    description:
      'Build a simple car and attach a balloon to it. When air escapes from the balloon, the car moves forward.',
    materials: ['Cardboard', 'Bottle caps', 'Straws', 'Wooden skewers', 'Balloon', 'Tape'],
    difficulty: 'Medium',
    duration: '20-25 mins',
    scientist: 'Isaac Newton',
    concept: "Newton's Third Law / Action & Reaction",
    emoji: '🚗',
    safety: null as string | null,
  },
  {
    id: 12,
    title: 'Paper Bridge Challenge',
    description: 'Build bridges using different paper shapes and test how many coins each design can support.',
    materials: ['Paper', 'Books', 'Coins'],
    difficulty: 'Medium',
    duration: '20-25 mins',
    scientist: 'Leonardo da Vinci',
    concept: 'Structural Engineering, Load Distribution & Material Strength',
    emoji: '🌉',
    safety: null as string | null,
  },
  {
    id: 13,
    title: 'Make Your Own Sundial',
    description:
      'Place a stick vertically in sunlight and mark the position of its shadow at different times during the day.',
    materials: ['Stick/pencil', 'Cardboard', 'Marker', 'Sunlight'],
    difficulty: 'Medium',
    duration: '60+ mins',
    scientist: 'Eratosthenes',
    concept: "Shadows, Earth's Rotation & Apparent Movement of the Sun",
    emoji: '☀️',
    safety: null as string | null,
  },
  {
    id: 14,
    title: 'Balloon Lung Model',
    description:
      'Build a simple model using balloons and a bottle to observe how changing air pressure and volume can make the balloon lungs expand and contract.',
    materials: ['Clear plastic bottle', 'Small balloons', 'Larger balloon', 'Straw', 'Tape'],
    difficulty: 'Medium',
    duration: '20-25 mins',
    scientist: 'Robert Boyle',
    concept: 'Air Pressure, Volume & Breathing Mechanics',
    emoji: '🫁',
    safety: '⚠️ Adult assistance required when preparing the bottle.' as string | null,
  },
  {
    id: 15,
    title: 'Build a Simple Compass',
    description:
      'Magnetize a needle and float it on a small piece of cork or foam in water. Observe the needle aligning approximately north-south.',
    materials: ['Small magnet', 'Steel needle', 'Cork/foam', 'Bowl', 'Water'],
    difficulty: 'Medium',
    duration: '15-20 mins',
    scientist: 'William Gilbert',
    concept: "Magnetism & Earth's Magnetic Field",
    emoji: '🧭',
    safety: '⚠️ Keep magnets and needles away from very young children.' as string | null,
  },
  {
    id: 16,
    title: 'Which Paper Plane Flies Furthest?',
    description:
      'Build several paper-plane designs and test each one multiple times. Measure and compare the distances.',
    materials: ['Paper', 'Measuring tape'],
    difficulty: 'Medium',
    duration: '20-25 mins',
    scientist: 'George Cayley',
    concept: 'Aerodynamics, Lift, Drag, Thrust & Gravity',
    emoji: '✈️',
    safety: null as string | null,
  },
  {
    id: 17,
    title: 'The Egg Drop Challenge',
    description:
      'Design a protective structure around an egg and test whether your design can protect it when dropped from a safe low height.',
    materials: ['Egg', 'Paper', 'Straws', 'Cotton', 'Cardboard', 'Tape'],
    difficulty: 'Medium',
    duration: '25-30 mins',
    scientist: 'Isaac Newton',
    concept: 'Impact Forces, Momentum, Acceleration & Energy Absorption',
    emoji: '🥚',
    safety: '⚠️ Adult supervision and a safe testing area are required.' as string | null,
  },
  {
    id: 18,
    title: 'Build a Rain Gauge',
    description:
      'Make a simple rain gauge from a transparent bottle and record how much rain falls over several days.',
    materials: ['Clear plastic bottle', 'Ruler', 'Marker', 'Small stones'],
    difficulty: 'Easy',
    duration: '15-20 mins',
    scientist: 'Luke Howard',
    concept: 'Rainfall Measurement & Weather Science',
    emoji: '🌧️',
    safety: null as string | null,
  },
  {
    id: 19,
    title: 'Soil Detective',
    description:
      'Mix soil and water in a transparent jar, allow it to settle and observe different layers forming.',
    materials: ['Transparent jar', 'Soil', 'Water'],
    difficulty: 'Easy',
    duration: '15-20 mins',
    scientist: 'Justus von Liebig',
    concept: 'Soil Composition, Sedimentation & Particle Size',
    emoji: '🪱',
    safety: null as string | null,
  },
  {
    id: 20,
    title: 'Seed Germination Investigation',
    description: 'Place beans on wet cotton and observe how roots and shoots develop over several days.',
    materials: ['Beans', 'Cotton', 'Transparent glass/jar', 'Water'],
    difficulty: 'Easy',
    duration: '5-7 days observation',
    scientist: 'Gregor Mendel',
    concept: 'Seed Germination & Plant Growth',
    emoji: '🌱',
    safety: null as string | null,
  },
  {
    id: 21,
    title: 'Build a Simple Electromagnet',
    description:
      'Wrap insulated copper wire around an iron nail and briefly connect it to a small battery. Test whether the nail can pick up paper clips.',
    materials: ['Iron nail', 'Insulated copper wire', 'Small battery', 'Paper clips'],
    difficulty: 'Medium',
    duration: '20-25 mins',
    scientist: 'Michael Faraday',
    concept: 'Electricity Creating Magnetism',
    emoji: '🧲',
    safety: '⚠️ Use only a small battery. Disconnect promptly if the wire becomes warm.' as string | null,
  },
  {
    id: 22,
    title: 'Which Material Keeps Heat In?',
    description:
      'Wrap cups of warm water with different materials and measure the temperature over time to discover which material provides better insulation.',
    materials: ['Several cups', 'Warm water', 'Thermometer', 'Cotton', 'Paper', 'Cloth', 'Aluminium foil'],
    difficulty: 'Medium',
    duration: '30-40 mins',
    scientist: 'James Prescott Joule',
    concept: 'Thermal Insulation & Heat Transfer',
    emoji: '🌡️',
    safety: null as string | null,
  },
  {
    id: 23,
    title: 'Make a Mini Ecosystem',
    description:
      'Create a small planted environment in a transparent container and observe moisture, condensation, plants and soil over several days.',
    materials: ['Transparent container', 'Soil', 'Small plant/moss', 'Pebbles', 'Water'],
    difficulty: 'Medium',
    duration: '3-5 days observation',
    scientist: 'Alexander von Humboldt',
    concept: 'Ecosystems, Water Cycle & Interdependence',
    emoji: '🌿',
    safety: null as string | null,
  },
  {
    id: 24,
    title: 'Make Your Own Crater',
    description:
      'Drop balls of different sizes from different heights onto a layer of flour or sand and measure the craters they create.',
    materials: ['Tray', 'Flour or sand', 'Cocoa powder', 'Small balls of different sizes', 'Ruler'],
    difficulty: 'Medium',
    duration: '20-25 mins',
    scientist: 'Eugene Shoemaker',
    concept: 'Impact Forces, Energy & Planetary Surfaces',
    emoji: '🌑',
    safety: null as string | null,
  },
  {
    id: 25,
    title: 'Build a Solar Oven',
    description:
      'Build a simple solar oven using a cardboard box, foil and insulating materials and investigate how sunlight can be converted into heat.',
    materials: ['Cardboard box', 'Aluminium foil', 'Transparent plastic wrap', 'Black paper', 'Tape'],
    difficulty: 'Medium',
    duration: '30-40 mins',
    scientist: 'Augustin Mouchot',
    concept: 'Solar Energy, Heat Absorption, Reflection & Insulation',
    emoji: '☀️',
    safety: '⚠️ Adult supervision required. Do not look directly at concentrated sunlight.' as string | null,
  },
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
              if (exp.id === 1) {
                router.push('/experiment-detail');
                return;
              }
              if (exp.description === 'Coming soon...') {
                Alert.alert('🧪 Coming Soon!', 'This experiment is coming soon!');
                return;
              }
              Alert.alert(
                `${exp.emoji} ${exp.title}`,
                `📖 ${exp.description}\n\n💡 Concept: ${exp.concept}\n\n🔬 Scientist: ${exp.scientist}\n\n🛒 Materials:\n${exp.materials.map(m => `• ${m}`).join('\n')}${exp.safety ? `\n\n${exp.safety}` : ''}`,
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
              {exp.id >= 21 && <Text style={styles.explorerBadge}>🔵 Explorer Level</Text>}
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
  explorerBadge: {
    fontSize: 10,
    fontFamily: typography.fontFamily.headingBold,
    color: '#60A5FA',
    marginTop: 2,
    letterSpacing: 0.5,
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
