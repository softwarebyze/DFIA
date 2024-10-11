import messaging from "@react-native-firebase/messaging";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { AuthContext } from "app/_layout";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
// import { PushProvider } from "stream-chat";
// import { StreamChat } from 'stream-chat';
// import { useAuth } from './AuthProvider';
import * as Notifications from 'expo-notifications';

// const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

const onNotifeeMessageReceived = async (message: any) => {
  console.log("onNotifeeMessageReceived", message);
};

messaging().setBackgroundMessageHandler(onNotifeeMessageReceived);
messaging().onMessage(onNotifeeMessageReceived);

export default function NotificationsProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  //   const { user } = useAuth();\
  const { isLoading, user } = useContext(AuthContext);

  const client = useStreamVideoClient()!;

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    await Notifications.requestPermissionsAsync();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  };

  useEffect(() => {
    // Register FCM token with stream chat server.
    const registerPushToken = async () => {
      let token = null;
      try {
        token = await messaging().getToken();
      } catch (error) {
        console.error(error);
      }
      if (!token) {
        console.warn("No token");
        return;
      }

      const push_provider: "apn" | "firebase" = Platform.select({
        ios: "apn",
        android: "firebase",
        web: "firebase",
        macos: "apn",
        windows: "firebase",
        native: "firebase",
      });

      const push_provider_name: "voip" | "firebase" = Platform.select({
        ios: "voip",
        android: "firebase",
        web: "firebase",
        macos: "voip",
        windows: "firebase",
        native: "firebase",
      });

      client.addDevice(
        token,
        push_provider,
        push_provider_name,
        user?.uid,
        true
      );

      client.addVoipDevice(token, push_provider, push_provider_name, user?.uid);

      // client.setLocalDevice({
      //   id: token,
      //   push_provider,
      //   // push_provider_name is meant for optional multiple providers support, see: https://getstream.io/chat/docs/react/push_providers_and_multi_bundle
      //   push_provider_name,
      // });
    };

    const init = async () => {
      await requestPermission();
      await registerPushToken();

      setIsReady(true);
    };

    init();
  }, []);

  return <>{children}</>;
}
