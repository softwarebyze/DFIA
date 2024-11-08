// app/index.tsx
import { Text } from "~/components/nativewindui/Text";

import { SignIn } from "components/SignIn";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Screen } from "~/components/Screen";
import { AuthContext } from "./_layout";

export default function Index() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

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
      <Text variant="largeTitle" className="text-primary font-bold italic">
        DFIA
      </Text>
      <Text className="text-secondary text-2 mb-8">Don't Face It Alone</Text>
      <SignIn />
    </Screen>
  );
}
