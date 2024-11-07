// app/home/_layout.tsx
import messaging from "@react-native-firebase/messaging";
import NotificationsProvider from "components/NotificationsProvider";
import { StreamVideo } from "components/StreamVideo";
import { Stack, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../_layout";

export default function AuthenticatedLayout() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // `onNotificationOpenedApp` gets called when app is in background, and you press
    // the push notification.
    //
    // Here its assumed a message-notification contains a "channel" property in the data payload.
    //
    // Please check the docs on push template:
    // https://getstream.io/chat/docs/javascript/push_template/?language=javascript
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "[home/_layout:messaging().onNotificationOpenedApp] Notification caused app to open from background state:",
        remoteMessage
      );
      // const channel = JSON.parse(remoteMessage.data.channel);
      // const message = remoteMessage.data.message;

      // console.log('This message belongs to channel with id - ', channel.id);
      // console.log('Message id is', message);

      // You will add your navigation logic, to navigate to relevant channel screen.
    });

    // `getInitialNotification` gets called when app is in quit state, and you press
    // the push notification.
    //
    //
    // Here its assumed that a message-notification contains a "channel" property in the data payload.
    // Please check the docs on push template:
    // https://getstream.io/chat/docs/javascript/push_template/?language=javascript
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quite state:",
            remoteMessage
          );
          // const channel = JSON.parse(remoteMessage.data.channel);
          // const message = remoteMessage.data.message;

          // console.log('This message belongs to channel with id - ', channel.id);
          // console.log('Message id is', message);

          // You will add your navigation logic, to navigate to relevant channel screen.
        } else {
          console.log("No initial notification", remoteMessage);
        }
      });
  }, []);

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
  console.log("AuthdLayout", user.uid);
  return (
    <StreamVideo user={user}>
      <NotificationsProvider>
        <Stack screenOptions={{ headerTitle: "" }} />
      </NotificationsProvider>
    </StreamVideo>
  );
}
