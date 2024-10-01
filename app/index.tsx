// app/index.tsx
import { colorPallet } from "@stream-io/video-react-native-sdk";
import { Screen } from "components/Screen";
import { SignIn } from "components/SignIn";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Text,
  View,
} from "react-native";
import { AuthContext } from "./_layout";

export default function Index() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS !== "android") return;
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      console.log(res); // 'granted' | 'denied' | 'never_ask_again'
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [user, isLoading]);

  if (isLoading) {
    // Optionally display a loading indicator
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Screen>
      <Text
        style={{
          color: colorPallet.dark.primary,
          fontSize: 48,
          fontWeight: "bold",
          fontStyle: "italic",
        }}
      >
        DFIA
      </Text>
      <Text
        style={{
          color: colorPallet.dark.secondary,
          fontSize: 24,
          marginBottom: 28,
        }}
      >
        Don't Face It Alone
      </Text>
      <SignIn />
    </Screen>
  );
}
