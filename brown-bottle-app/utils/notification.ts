import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";

// Ensures Android has a notification channel so notifications display properly.
export async function ensureAndroidNotificationChannelAsync() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
  });
}

// Registers the current device for push notifications
export async function registerForPushNotificationsAsync() {
  await ensureAndroidNotificationChannelAsync();
  // Push notifications do not work on simulators and ignore on web
  if (!Device.isDevice) {
    return null;
  }

  if (Platform.OS === "web") {
    return null;
  }

  // Check existing notification permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  // Request permission if not already granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Exit early if permission denied
  if (finalStatus !== "granted") {
    return null;
  }

  // REQUIRED: explicitly provide projectId
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId ??
    "56a5de34-e262-4d71-b648-161a8850cc35"; // Hardcode as last resort for local dev

  if (!projectId) {
    throw new Error("Expo projectId not found");
  }

  // Get Expo push token for this device
  try {
    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    // console.log(`--> SUCCESS! Token: ${tokenResponse.data}`);
    return tokenResponse.data;
  } catch (e) {
    console.error("--> ERROR: Failed to get token:", e);
    return null;
  }
}
