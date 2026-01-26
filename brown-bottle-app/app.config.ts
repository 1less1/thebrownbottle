import "dotenv/config";
import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "brown-bottle-app",
  slug: "brown-bottle-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",

  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    userInterfaceStyle: "light",
  },
  android: {
    package: "com.brownbottle.app",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-secure-store",
    "expo-web-browser",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // This allows Constants.expoConfig.extra.eas.projectId to work
    eas: {
      projectId:
        process.env.EXPO_PUBLIC_EAS_PROJECT_ID ??
        "56a5de34-e262-4d71-b648-161a8850cc35",
    },
    // This passes your URL to Constants
    API_BASE_URL: process.env.EXPO_PUBLIC_API_URL,
  },
});
