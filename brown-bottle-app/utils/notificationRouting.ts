import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

type NotificationNav = {
  pathname?: string;
  params?: Record<string, string | number>;
};

type NotificationUI = {
  calendarTab?: string;
};

type NotificationData = {
  event?: string;
  nav?: NotificationNav;
  ui?: NotificationUI;
};

const CALENDAR_PENDING_TAB_KEY = "calendarPendingTab";

/**
 * Routes the user based on the data payload attached to a push notification.
 */
async function routeFromNotificationData(data?: NotificationData) {
  // Routes from notification data (nav + optional UI hints) to the correct screen
  if (!data) return;

  const pathname = data.nav?.pathname;
  if (!pathname) return;

  // Apply UI hints FIRST (so the destination screen can read it on focus)
  const calendarTab = data.ui?.calendarTab;
  if (calendarTab) {
    await AsyncStorage.setItem(CALENDAR_PENDING_TAB_KEY, calendarTab);
  }

  // Navigate to the screen/tab
  router.push({
    pathname: pathname as any,
    params: (data.nav?.params ?? {}) as any,
  });
}

/**
 * Registers listeners for notification taps (killed/background/foreground).
 * Returns a cleanup function.
 */
export function registerNotificationTapRouting() {
  // Handles the cold start case (app killed → opened by notification tap)
  (async () => {
    const last = await Notifications.getLastNotificationResponseAsync();
    const data = last?.notification.request.content.data as any;
    await routeFromNotificationData(data);
  })();

  // Handles taps when the app is backgrounded or foregrounded
  const sub = Notifications.addNotificationResponseReceivedListener(
    async (response) => {
      const data = response.notification.request.content.data as any;
      await routeFromNotificationData(data);
    }
  );

  return () => sub.remove();
}