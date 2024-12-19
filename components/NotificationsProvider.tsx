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
// import notifee from "@notifee/react-native";
// import * as Notifications from "expo-notifications";

// const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

// type OnNotifeeMessageReceived = (
//   message: FirebaseMessagingTypes.RemoteMessage
// ) => Promise<any>;

// example remoteMessage:
// {
//   "sentTime": 1729535722484,
//   "data": {
//       "created_by_id": "HIhKgOYmGDT5AgBH4CwSt8DXgVC2",
//       "version": "v2",
//       "created_by_display_name": "HIhKgOYmGDT5AgBH4CwSt8DXgVC2",
//       "receiver_id": "vmljsmXYDBMloSozpWUxZSQdSHj2",
//       "call_cid": "default:1729535704549-Zack",
//       "call_display_name": "",
//       "type": "call.missed",
//       "sender": "stream.video"
//   },
//   "messageId": "0:1729535722503677%11e01e4ff9fd7ecd",
//   "ttl": 2419200,
//   "from": "1064247809898"
// }

// // https://arc.net/l/quote/nigntfjt
// const onNotifeeMessageReceived: OnNotifeeMessageReceived = async (
//   remoteMessage
// ) => {
//   console.log("onNotifeeMessageReceived", remoteMessage);

//   const userId = remoteMessage.data?.receiver_id as string;
//   const callCid = remoteMessage.data?.call_cid as string;

//   if (!userId) {
//     console.error("No user id found in message");
//     return;
//   }

//   if (!callCid) {
//     console.error("No call cid found in message");
//     return;
//   }

//   // @ts-ignore
//   const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);
//   client
//     ._setToken(
//       {
//         id: userId,
//       },
//       getStreamUserToken
//     )
//     .then(() => {
//       console.log("set token");
//     })
//     .catch((error) => {
//       console.error("error with client._setToken", error);
//     });

//   // handle the message
//   // const message = await client.getMessage(callCid);

//   // create the android channel to send the notification to
//   const channelId = await notifee.createChannel({
//     id: "default-channel-id",
//     name: "Calls",
//   });

//   // display the notification
//   const { stream, ...rest } = remoteMessage.data ?? {};
//   const data = {
//     ...rest,
//     ...((stream as unknown as Record<string, string> | undefined) ?? {}), // extract and merge stream object if present
//   };
//   await notifee.displayNotification({
//     // title: 'New call from ' + message.message.user?.name,
//     title: "New call",
//     // body: message.message.text,
//     data,
//     android: {
//       channelId,
//       // add a press action to open the app on press
//       pressAction: {
//         id: "default",
//       },
//     },
//   });
// };
// });

// messaging().setBackgroundMessageHandler(onNotifeeMessageReceived);
// const onMessage = async (message: FirebaseMessagingTypes.RemoteMessage) => {
//   console.log("onMessage", message);
//   const callCid = message.data?.call_cid as string;
//   if (!callCid) {
//     console.error("No call cid found in message");
//     return;
//   }
//   router.replace(`/[${callCid}]`);
//   // return onNotifeeMessageReceived(message);
// };
// messaging().onMessage(onMessage);

// notifee.onBackgroundEvent(async (event) =>
//   console.log("[notifee.onBackgroundEvent]", event)
// );

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
      console.log("User denied permissions request");
      return false;
    } else if (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED
    ) {
      console.log("User granted permissions request");
    } else if (
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    ) {
      console.log("User provisionally granted permissions request");
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
        console.log("!messaging().isDeviceRegisteredForRemoteMessages");
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
