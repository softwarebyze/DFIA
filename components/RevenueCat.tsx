import { analytics } from "analytics";
import { useEffect } from "react";
import { Platform, Alert } from "react-native";
import Purchases from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";

Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);

const useConfigureRevenueCat = () =>
  useEffect(() => {
    if (Platform.OS === "ios") {
      // @ts-ignore
      const EXPO_PUBLIC_RC_IOS = process.env.EXPO_PUBLIC_RC_IOS!;
      if (!EXPO_PUBLIC_RC_IOS) {
        Alert.alert(
          "Error configure RC",
          "RevenueCat API key for ios not provided"
        );
      } else {
        Purchases.configure({ apiKey: EXPO_PUBLIC_RC_IOS });
      }
    } else if (Platform.OS === "android") {
      // @ts-ignore
      const EXPO_PUBLIC_RC_ANDROID = process.env.EXPO_PUBLIC_RC_ANDROID;
      if (!EXPO_PUBLIC_RC_ANDROID) {
        Alert.alert(
          "Error configure RC",
          "RevenueCat API key for android not provided"
        );
      } else {
        Purchases.configure({ apiKey: EXPO_PUBLIC_RC_ANDROID });
      }
    }
  }, []);

export const RevenueCat = ({ children }: { children: React.ReactNode }) => {
  useConfigureRevenueCat();
  return <>{children}</>;
};

export const presentProPaywall = async (): Promise<boolean> => {
  const result = await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: "pro",
  });
  analytics.track("presentProPaywall", {
    result,
  });
  return [
    RevenueCatUI.PAYWALL_RESULT.PURCHASED,
    RevenueCatUI.PAYWALL_RESULT.NOT_PRESENTED,
    RevenueCatUI.PAYWALL_RESULT.RESTORED,
  ].includes(result);
};
