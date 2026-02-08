import { getFirebaseIdToken } from "./getFirebaseIdToken";
import { Platform } from "react-native";
import { auth } from "./firebase";
import type { Employee } from "@/types/iEmployee";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

/**
 * signInAndFetchEmployee():
 * - Gets a Firebase ID token (platform-specific)
 * - Sends it to your backend for validation
 * - Returns the employee payload if allowed
 */
export async function signInAndFetchEmployee(): Promise<Employee> {
  if (!apiUrl) throw new Error("Missing API base URL.");

  let idToken: string;

  try {
    // getFirebaseIdToken(): returns Firebase ID token (web/native)
    idToken = await getFirebaseIdToken(false);
  } catch (err: any) {
    // Normalize "cancel" into a single code so the UI can handle it cleanly
    if (
      err?.code === "SIGN_IN_CANCELLED" ||
      err?.message === "SIGN_IN_CANCELLED" ||
      String(err?.message || "").includes("SIGN_IN_CANCELLED")
    ) {
      const cancelErr: any = new Error("SIGN_IN_CANCELLED");
      cancelErr.code = "SIGN_IN_CANCELLED";
      throw cancelErr;
    }

    // Some versions throw this when signIn() was cancelled and getTokens() is called
    if (
      String(err?.message || "").includes(
        "getTokens requires a user to be signed in"
      )
    ) {
      const cancelErr: any = new Error("SIGN_IN_CANCELLED");
      cancelErr.code = "SIGN_IN_CANCELLED";
      throw cancelErr;
    }

    throw err;
  }

  // First backend attempt
  let resp = await fetch(`${apiUrl}/auth/firebase-login`, {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
  });

  // If unauthorized, retry once with a forced refresh token
  if (resp.status === 401) {
    const refreshedToken = await getFirebaseIdToken(true);

    resp = await fetch(`${apiUrl}/auth/firebase-login`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshedToken}` },
    });
  }

  if (!resp.ok) {
    const err: any = new Error("Backend rejected Google login.");
    err.status = resp.status;

    // Treat 401 the same as 403: clear cached auth so retry starts clean
    if (resp.status === 401 || resp.status === 403) {
      await logout();
    }

    throw err;
  }

  const data = await resp.json();

  if (!data?.employee) {
    throw new Error("Login failed (missing employee).");
  }

  return data.employee as Employee;
}

/**
 * logout():
 * - Signs out of Firebase
 * - On native, also signs out of Google to clear cached account selection
 */
export async function logout(): Promise<void> {
  // Firebase logout
  try {
    const { signOut } = require("firebase/auth");
    await signOut(auth);
  } catch (err) {
    console.warn("Firebase logout failed (continuing):", err);
  }

  // Native Google logout (clear cached account)
  if (Platform.OS !== "web") {
    try {
      const { GoogleSignin } = require("@react-native-google-signin/google-signin");

      // Ensure configure() ran at least once (prevents "apiClient is null")
      const webClientId = process.env.EXPO_PUBLIC_WEB_ID;
      const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

      if (webClientId) {
        GoogleSignin.configure({
          webClientId,
          iosClientId,
          offlineAccess: false,
          forceCodeForRefreshToken: false,
        });
      }

      await GoogleSignin.signOut();
    } catch (err) {
      console.warn("Google logout failed (continuing):", err);
    }
  }
}

/**
 * fetchEmployeeFromExistingSession():
 * - Uses current Firebase user (if present)
 * - Uses cached ID token by default (no force refresh)
 * - If backend returns 401 once, retries with a forced refresh token
 */
export async function fetchEmployeeFromExistingSession(): Promise<Employee | null> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  if (!apiUrl) {
    throw new Error("Missing API base URL (EXPO_PUBLIC_API_URL).");
  }

  // First attempt: do NOT force refresh
  let token = await firebaseUser.getIdToken(false);

  let resp = await fetch(`${apiUrl}/auth/firebase-login`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Retry once on 401 with forced refresh
  if (resp.status === 401) {
    token = await firebaseUser.getIdToken(true);

    resp = await fetch(`${apiUrl}/auth/firebase-login`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  if (!resp.ok) {
    const err: any = new Error("Backend rejected existing session.");
    err.status = resp.status;

    // Treat 401 the same as 403: clear cached auth so app doesn't loop
    if (resp.status === 401 || resp.status === 403) {
      await logout();
    }

    throw err;
  }

  const data = await resp.json();
  return (data?.employee ?? null) as Employee | null;
}
