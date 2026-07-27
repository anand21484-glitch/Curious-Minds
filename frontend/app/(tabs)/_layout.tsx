import { Redirect, Tabs } from 'expo-router';
import { ColorValue, View } from 'react-native';
import { useAppState } from '../../src/state/AppState';
import { colors, tabBar, typography } from '../../src/theme';

function TabDot({ color }: { color: ColorValue }) {
  return (
    <View
      style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }}
    />
  );
}

export default function TabsLayout() {
  const { loading, userName } = useAppState();
  if (!loading && !userName) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: tabBar.inactive,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.headingBold,
          fontSize: typography.size.microLabel,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.hairline,
        },
        tabBarItemStyle: {
          paddingTop: 10,
          gap: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarActiveTintColor: tabBar.home,
          tabBarIcon: ({ color }) => <TabDot color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarActiveTintColor: tabBar.explore,
          tabBarIcon: ({ color }) => <TabDot color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarActiveTintColor: tabBar.quiz,
          tabBarIcon: ({ color }) => <TabDot color={color} />,
        }}
      />
      <Tabs.Screen
        name="rank"
        options={{
          title: 'Scoreboard',
          tabBarActiveTintColor: tabBar.rank,
          tabBarIcon: ({ color }) => <TabDot color={color} />,
        }}
      />
    </Tabs>
  );
}
