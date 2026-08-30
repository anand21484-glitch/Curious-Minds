import { Poppins_700Bold, Poppins_800ExtraBold } from '@expo-google-fonts/poppins';
import { Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/theme';
import { AppStateProvider, useAppState } from '../src/state/AppState';

function RootNavigator() {
  const { loading, userName } = useAppState();
  if (loading) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Protected guard={!!userName}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!userName}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Screen name="mission" />
      <Stack.Screen name="scientist/[id]" />
      <Stack.Screen name="think-fast" />
      <Stack.Screen name="parents" />
    </Stack>
  );
}

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <RootNavigator />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
