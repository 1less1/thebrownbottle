import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

/**
 * getFirebaseIdToken():
 * Gets a Firebase ID token for web using the Google popup flow.
 *
 * @param forceRefresh - If true, forces Firebase to mint a fresh ID token.
 */
export async function getFirebaseIdToken(
  forceRefresh: boolean = false,
): Promise<string> {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);

  // Use cached token by default; only force refresh when explicitly asked
  const idToken = await result.user.getIdToken(forceRefresh);

  return idToken;
}
