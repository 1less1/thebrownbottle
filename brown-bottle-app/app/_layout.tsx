import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from "react-native-toast-message";

import { Colors } from '@/constants/Colors';
import { ShiftRefreshProvider } from '@/utils/ShiftRefreshContext';
import { SessionProvider, useSession } from '@/utils/SessionContext';

// Force light theme
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';

// Set the notification handler for the app
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Component that handles splash screen hiding after auth decision
function SplashHandler({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { sessionLoading, user } = useSession();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!fontsLoaded || sessionLoading) return;

    // Handle redirect if accessing tabs without auth
    if (segments[0] === '(tabs)' && !user?.employee_id) {
      router.replace('/');
    }

    // Hide splash after auth decision is made
    SplashScreen.hideAsync();
  }, [fontsLoaded, sessionLoading, user?.employee_id, segments, router]);

  return null;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <SessionProvider>
        <ShiftRefreshProvider>
          <SplashHandler fontsLoaded={loaded} />
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors.mediumTan,
              },
              headerTintColor: Colors.black,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <Toast />
        </ShiftRefreshProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
