import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import RevenueCatUI from "react-native-purchases-ui";

import Purchases from "react-native-purchases";

Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);

export default function App() {
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

  const onPress = async () => {
    const result = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: "pro",
    });
    if (
      [
        RevenueCatUI.PAYWALL_RESULT.PURCHASED,
        RevenueCatUI.PAYWALL_RESULT.NOT_PRESENTED,
        RevenueCatUI.PAYWALL_RESULT.RESTORED,
      ].includes(result)
    ) {
      alert("Calling angel...");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: "#EFFFB0",
          paddingVertical: 15,
          paddingHorizontal: 43,
          borderRadius: 40,
        }}
        onPress={onPress}
      >
        <Text style={{ fontSize: 22 }}>Call an Angel</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
});
