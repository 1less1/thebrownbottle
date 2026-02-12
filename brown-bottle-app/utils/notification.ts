import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

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

const PUSH_TOKEN_KEY = "expo_push_token";

// Persists the Expo push token so we can unregister it on logout.
export async function savePushTokenToStorageAsync(
  token: string | null,
): Promise<void> {
  if (Platform.OS === "web") {
    if (token) localStorage.setItem(PUSH_TOKEN_KEY, token);
    else localStorage.removeItem(PUSH_TOKEN_KEY);
    return;
  }

  if (token) await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(PUSH_TOKEN_KEY);
}

/**
 * getStoredPushTokenAsync
 * - Retrieves the saved Expo push token from storage.
 */
export async function getStoredPushTokenAsync(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(PUSH_TOKEN_KEY);
  }

  return await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
}

/**
 * clearStoredPushTokenAsync
 * - Removes the saved Expo push token from storage.
 */
export async function clearStoredPushTokenAsync(): Promise<void> {
  await savePushTokenToStorageAsync(null);
}

/**
 * unregisterPushTokenAsync
 * - Removes this device's Expo push token from backend so logged-out users
 *   no longer receive push notifications.
 * - Uses DELETE /push-token/delete (your Flask route).
 */
export async function unregisterPushTokenAsync(userId: number): Promise<void> {
  // Web doesn't use Expo push tokens in your current setup.
  if (Platform.OS === "web") return;

  const token = await getStoredPushTokenAsync();
  if (!token) return;

  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    "";

  if (!apiUrl) return;

  try {
    await fetch(`${apiUrl}/push-token/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      // Flask can read JSON bodies on DELETE if Content-Type is JSON.
      body: JSON.stringify({
        user_id: userId,
        expo_push_token: token,
      }),
    });
  } catch (e) {
    console.warn("Failed to unregister push token (continuing):", e);
  } finally {
    // Clear locally either way to avoid keeping stale tokens around.
    await clearStoredPushTokenAsync();
  }
}
