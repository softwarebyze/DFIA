// @ts-ignore
const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  name: IS_DEV ? "DFIA (Dev)" : "DFIA",
  scheme: "dfia",
  slug: "DFIA",
  version: "1.0.0",
  orientation: "portrait",
  icon: IS_DEV ? "./assets/dev-icon.png" : "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV
      ? "com.zackebenfeld.DFIA.dev"
      : "com.zackebenfeld.DFIA",
    googleServicesFile: "./GoogleService-Info.plist",
    bitcode: false,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: IS_DEV ? "com.zackebenfeld.DFIA.dev" : "com.zackebenfeld.DFIA",
    googleServicesFile: "./google-services.json",
    permissions: [
      "android.permission.BLUETOOTH",
      "android.permission.BLUETOOTH_CONNECT",
      "android.permission.BLUETOOTH_ADMIN",
      "android.permission.POST_NOTIFICATIONS",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.CAMERA",
      "android.permission.INTERNET",
      "android.permission.MODIFY_AUDIO_SETTINGS",
      "android.permission.RECORD_AUDIO",
      "android.permission.SYSTEM_ALERT_WINDOW",
      "android.permission.WAKE_LOCK",
    ],
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "b2f85947-bb55-4ed4-bd8b-04ed81831375",
    },
  },
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          extraMavenRepos: [
            "../../node_modules/@notifee/react-native/android/libs",
          ],
          minSdkVersion: 24,
        },
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    [
      "@stream-io/video-react-native-sdk",
      {
        enableNonRingingPushNotifications: true,
        ringingPushNotifications: {
          disableVideoIos: false,
          includesCallsInRecentsIos: false,
          showWhenLockedAndroid: true,
        },
      },
    ],
    "@config-plugins/react-native-callkeep",
    "@react-native-firebase/app",
    "@react-native-firebase/messaging",
    [
      "@config-plugins/react-native-webrtc",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
      },
    ],
    "expo-router",
  ],
  owner: "zackebenfeld",
};
