import messaging from "@react-native-firebase/messaging";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
// import { PushProvider } from "stream-chat";
// import { useAuth } from './AuthProvider';
import notifee, { AuthorizationStatus } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { AuthContext } from "context/AuthContext";
export default function NotificationsProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  //   const { user } = useAuth();\
  const { isLoading, user } = useContext(AuthContext);
  const unsubscribeTokenRefreshListenerRef = useRef<() => void>();

  const client = useStreamVideoClient()!;

  const requestPermission = async () => {
    // https://notifee.app/react-native/docs/ios/permissions#notifee
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
      return false;
    } else if (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED
    ) {
    } else if (
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    ) {
    }

    const authStatus = await messaging().requestPermission(); // permission to display remote notifications from FCM https://rnfirebase.io/messaging/ios-permissions#requesting-permissions
    // await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    // );
    // await notifee.requestPermission();
    // await Notifications.requestPermissionsAsync();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    return enabled;
  };

  useEffect(() => {
    // Register FCM token with stream chat server.
    const registerPushToken = async () => {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }

      let token = null;
      try {
        token = await messaging().getToken();
        console.log("token", token);
      } catch (error) {
        console.error(error);
      }
      if (!token) {
        console.warn("No token");
        return;
      }

      const push_provider = Platform.OS === "ios" ? "apn" : "firebase";

      const push_provider_name = Platform.OS === "ios" ? "voip" : "firebase";

      if (token) {
        await client.addDevice(
          token,
          push_provider,
          push_provider_name,
          user?.uid,
          true,
        );

        await client.addVoipDevice(
          token,
          push_provider,
          push_provider_name,
          user?.uid,
        );

        // client.setLocalDevice({
        //   id: token,
        //   push_provider,
        //   // push_provider_name is meant for optional multiple providers support, see: https://getstream.io/chat/docs/react/push_providers_and_multi_bundle
        //   push_provider_name,
        // });
      }
      const removeOldToken = async () => {
        const oldToken = await AsyncStorage.getItem("@current_push_token");
        if (oldToken !== null) {
          await client.removeDevice(oldToken);
        }
      };

      unsubscribeTokenRefreshListenerRef.current = messaging().onTokenRefresh(
        async newToken => {
          console.log("onTokenRefresh");
          await Promise.all([
            removeOldToken(),
            client.addDevice(
              newToken,
              push_provider,
              push_provider_name,
              user?.uid,
              true,
            ),
            AsyncStorage.setItem("@current_push_token", newToken),
          ]);
        },
      );
    };

    const init = async () => {
      const permissionEnabled = await requestPermission();
      if (permissionEnabled) await registerPushToken();

      setIsReady(true);
    };

    init();

    return () => {
      console.log("unsubscribing from messaging");
      unsubscribeTokenRefreshListenerRef.current?.();
    };
  }, []);

  return <>{children}</>;
}
