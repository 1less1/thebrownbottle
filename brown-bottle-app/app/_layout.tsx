import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '@/constants/Colors';
import { SessionProvider, useSession } from '@/utils/SessionContext';

// Force light theme
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';

/**
 * Stored when a user taps a notification while logged out.
 * After login/session restore, we apply this route.
 */
const PENDING_NOTIFICATION_NAV_KEY = 'pendingNotificationNav';

/**
 * Stored when a notification wants to open a Calendar subtab.
 * Your Calendar page already reads and applies this.
 */
const CALENDAR_PENDING_TAB_KEY = 'calendarPendingTab';

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

/**
 * Reads a tapped notification payload and either:
 * - routes immediately (if authed), or
 * - stores pending navigation to apply after login.
 */
async function handleNotificationTapRouting(
  data: any,
  isAuthed: boolean,
  router: ReturnType<typeof useRouter>
) {
  // Routes based on notification data payload (nav + optional UI hints)
  if (!data?.nav?.pathname) return;

  const pathname: string = data.nav.pathname;
  const params = data.nav.params ?? {};
  const calendarTab: string | undefined = data.ui?.calendarTab;

  // Apply Calendar subtab hint before navigation so Calendar page can pick it up on focus
  if (calendarTab) {
    await AsyncStorage.setItem(CALENDAR_PENDING_TAB_KEY, calendarTab);
  }

  // If not authed, store the intended navigation and let auth flow proceed
  if (!isAuthed) {
    await AsyncStorage.setItem(
      PENDING_NOTIFICATION_NAV_KEY,
      JSON.stringify({ pathname, params })
    );
    return;
  }

  // Authed -> navigate now
  router.push({ pathname: pathname as any, params: params as any });
}

/**
 * Handles splash screen hiding + auth-based redirect decisions.
 */
function SplashHandler({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { sessionLoading, user } = useSession();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Hides splash once fonts + session decision are complete
    if (!fontsLoaded || sessionLoading) return;

    // Redirect if accessing tabs without auth
    if (segments[0] === '(tabs)' && !user?.employee_id) {
      router.replace('/');
    }

    SplashScreen.hideAsync();
  }, [fontsLoaded, sessionLoading, user?.employee_id, segments, router]);

  return null;
}

/**
 * Registers notification listeners and applies deferred navigation after login.
 * Must be inside SessionProvider so we can check auth state.
 */
function NotificationRoutingGate() {
  const { sessionLoading, user } = useSession();
  const router = useRouter();

  const isAuthed = !!user?.employee_id;

  const applyDeferredNavigation = useCallback(async () => {
    // Applies any stored pending navigation after auth is available
    try {
      const pending = await AsyncStorage.getItem(PENDING_NOTIFICATION_NAV_KEY);
      if (!pending) return;

      const parsed = JSON.parse(pending);
      if (parsed?.pathname && isAuthed) {
        await AsyncStorage.removeItem(PENDING_NOTIFICATION_NAV_KEY);
        router.push({ pathname: parsed.pathname as any, params: (parsed.params ?? {}) as any });
      }
    } catch (err) {
      console.warn('Failed to apply deferred notification navigation:', err);
    }
  }, [isAuthed, router]);

  useEffect(() => {
    // Don’t do anything until session loading completes
    if (sessionLoading) return;

    // 1) Cold start case: app opened from killed state via notification tap
    (async () => {
      try {
        const last = await Notifications.getLastNotificationResponseAsync();
        const data = last?.notification?.request?.content?.data as any;
        await handleNotificationTapRouting(data, isAuthed, router);
      } catch (err) {
        console.warn('Failed to handle cold-start notification routing:', err);
      }
    })();

    // 2) Background/foreground: user taps a notification
    const responseSub = Notifications.addNotificationResponseReceivedListener(async (response) => {
      try {
        const data = response?.notification?.request?.content?.data as any;
        await handleNotificationTapRouting(data, isAuthed, router);
      } catch (err) {
        console.warn('Failed to handle notification tap routing:', err);
      }
    });

    // 3) If user is authed now, apply any deferred navigation saved earlier
    applyDeferredNavigation();

    return () => {
      responseSub.remove();
    };
  }, [sessionLoading, isAuthed, router, applyDeferredNavigation]);

  return null;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Optional: logs foreground received notifications (not taps)
  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received (foreground):', notification.request.content.data);
    });

    return () => {
      notificationListener.remove();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <SessionProvider>
        <NotificationRoutingGate />
        <SplashHandler fontsLoaded={loaded} />
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.mediumTan },
            headerTintColor: Colors.black,
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </SessionProvider>
    </ThemeProvider>
  );
}