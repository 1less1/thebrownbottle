import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase";

let isConfigured = false;

/**
 * configureGoogleSignin():
 * Configures Google Sign-In once (native only).
 */
function configureGoogleSignin(): void {
  if (isConfigured) return;

  const webClientId = process.env.EXPO_PUBLIC_WEB_ID;
  const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

  if (!webClientId) {
    throw new Error("Missing EXPO_PUBLIC_WEB_ID.");
  }

  GoogleSignin.configure({
    webClientId,
    iosClientId,
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });

  isConfigured = true;
}

/**
 * getFirebaseIdToken():
 * Native flow:
 * - Google sign-in -> Google idToken
 * - Firebase credential sign-in
 * - Return Firebase ID token
 *
 * @param forceRefresh - If true, forces Firebase to mint a fresh ID token.
 */
export async function getFirebaseIdToken(forceRefresh: boolean = false): Promise<string> {
  configureGoogleSignin();

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  try {
    await GoogleSignin.signIn();
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      const err: any = new Error("Sign-in cancelled");
      err.code = "SIGN_IN_CANCELLED";
      throw err;
    }

    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      const err: any = new Error("Play Services not available");
      err.code = "PLAY_SERVICES_NOT_AVAILABLE";
      throw err;
    }

    throw error;
  }

  const tokens = await GoogleSignin.getTokens();

  if (!tokens?.idToken) {
    throw new Error("Google idToken missing.");
  }

  const credential = GoogleAuthProvider.credential(tokens.idToken);
  await signInWithCredential(auth, credential);

  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    throw new Error("Firebase user missing after sign-in.");
  }

  // Use cached token by default; only force refresh when explicitly asked
  return await firebaseUser.getIdToken(forceRefresh);
}
