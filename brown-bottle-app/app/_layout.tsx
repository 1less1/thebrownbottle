import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from "react-native-toast-message";

import { Colors } from '@/constants/Colors';
import { SessionProvider } from '@/utils/SessionContext';

// Force light theme
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';

// Set the notification handler for the app
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true, // or false if you don't want sound
    shouldSetBadge: false,
  }),
});


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('--- Notification Received ---');
      console.log(notification);
      console.log('---------------------------');
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('--- Notification Tapped ---');
      console.log(response);
      console.log('-------------------------');
      // Here you could navigate to a specific screen based on the notification data
      // For example: router.push(`/announcement/${response.notification.request.content.data.announcement_id}`);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <SessionProvider>
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
      </SessionProvider>
    </ThemeProvider>
  );
}
