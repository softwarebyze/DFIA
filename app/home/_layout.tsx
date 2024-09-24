// app/home/_layout.tsx
import { StreamVideo } from "components/StreamVideo";
import { Slot, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../_layout";

export default function AuthenticatedLayout() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // If not authenticated, redirect to sign-in
      router.replace("/");
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    // Optionally display a loading indicator
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StreamVideo user={user}>
      <Slot />
    </StreamVideo>
  );
}
