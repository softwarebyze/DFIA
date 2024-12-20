import messaging from "@react-native-firebase/messaging";
import NotificationsProvider from "components/NotificationsProvider";
import { StreamVideo } from "components/StreamVideo";
import { AuthContext } from "context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

// Custom hook to handle notification behavior
const useNotificationHandlers = () => {
  useEffect(() => {
    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          "[useNotificationHandlers] Notification opened from background:",
          remoteMessage,
        );
        // TODO: Add navigation logic here
      });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            "[useNotificationHandlers] Notification opened from quit state:",
            remoteMessage,
          );
          // TODO: Add navigation logic here
        } else {
          console.log("[useNotificationHandlers] No initial notification.");
        }
      });

    // Cleanup the listeners on unmount
    return () => {
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);
};

export default function AuthenticatedLayout() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useNotificationHandlers();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/"); // Redirect to sign-in if unauthenticated
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StreamVideo user={user}>
      <NotificationsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </NotificationsProvider>
    </StreamVideo>
  );
}
