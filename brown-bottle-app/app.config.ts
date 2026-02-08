import "dotenv/config";
import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Brown Bottle Mobile",
  slug: "brown-bottle-app",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "brownbottle",

  newArchEnabled: true,

  ios: {
    bundleIdentifier: "com.brownbottle.brownbottleapp",
    googleServicesFile: "./GoogleService-Info.plist",
    supportsTablet: true,
    userInterfaceStyle: "light",
    icon: "./assets/images/brownbottleicon.png",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            "com.googleusercontent.apps.666874698134-g148uctlsjd92jnc82be33qgs62suan9",
          ],
        },
      ],
    },
  },

  android: {
    package: "com.brownbottle.brownbottleapp",
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptiveicon.png",
      backgroundColor: "#332219",
    },
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    "@react-native-google-signin/google-signin",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/brownbottlelogo.png",
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
    eas: {
      projectId:
        process.env.EXPO_PUBLIC_EAS_PROJECT_ID ??
        "21cfca82-3a43-420a-ba88-ddae8b6f644a",
    },
    API_BASE_URL: process.env.EXPO_PUBLIC_API_URL,
  },
});
