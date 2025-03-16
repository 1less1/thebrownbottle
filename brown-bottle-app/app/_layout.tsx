import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      
      {/* Universal status bar */}
      <StatusBar 
        backgroundColor={Colors.mediumTan} // Set your universal color here
        style="dark" // Text and Icon Coor
      />
      
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.mediumTan, // Ensure header matches status bar color
          },
          headerTintColor: Colors.black, // Header text color
        }}
      >
        {/* Landing Page Loaded First */}
        <Stack.Screen name="index" options={{headerShown: false}} />

        {/* Rest of app in (tabs) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="+not-found" />

      </Stack>

    </ThemeProvider>

  );
};

