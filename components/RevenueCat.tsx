import { analytics } from "analytics";
import { useEffect } from "react";
import { Alert, Platform } from "react-native";
import Purchases from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";

Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);

const configureRevenueCat = () => {
  const apiKey = Platform.select({
    // @ts-ignore
    ios: process.env.EXPO_PUBLIC_RC_IOS!,
    // @ts-ignore
    android: process.env.EXPO_PUBLIC_RC_ANDROID!,
  });

  if (!apiKey) {
    Alert.alert(
      "Error configure RC",
      "RevenueCat API key not provided"
    );
  } else {
    Purchases.configure({ apiKey });
  }
};

const useConfigureRevenueCat = () =>
  useEffect(() => {
    const setup = async () => {
      if (!(await Purchases.isConfigured())) {
        configureRevenueCat();
      }
    };

    setup();
  }, []);

export const RevenueCat = ({ children }: { children: React.ReactNode }) => {
  useConfigureRevenueCat();
  return children;
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
