import { ConfigContext, ExpoConfig } from "@expo/config";
// @ts-ignore
const IS_DEV = false; //process.env.APP_VARIANT === "development";

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 *
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  // const existingPlugins = config.plugins ?? []
  return {
    ...config,
    name: IS_DEV ? "DFIA (Dev)" : "DFIA",
    icon: IS_DEV ? "./assets/dev-icon.png" : "./assets/icon.png",
    ios: {
      ...config.ios,
      bundleIdentifier: IS_DEV
        ? "com.zackebenfeld.DFIA.dev"
        : "com.zackebenfeld.DFIA",
      googleServicesFile: IS_DEV
        ? "GoogleService-Info-Dev.plist"
        : "./GoogleService-Info.plist",
    },
    android: {
      ...config.android,
      package: IS_DEV ? "com.zackebenfeld.DFIA.dev" : "com.zackebenfeld.DFIA",
      googleServicesFile: IS_DEV
        ? "google-services-dev.json"
        : "./google-services.json",
    },
  };
};
