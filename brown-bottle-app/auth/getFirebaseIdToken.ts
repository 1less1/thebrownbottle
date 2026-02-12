import { Platform } from "react-native";

// getFirebaseIdToken
// - Runtime bridge to pick the correct platform implementation.
// - Keeps imports clean: authService can always import "./getFirebaseIdToken".
export const getFirebaseIdToken =
  Platform.OS === "web"
    ? require("./getFirebaseIdToken.web").getFirebaseIdToken
    : require("./getFirebaseIdToken.native").getFirebaseIdToken;
