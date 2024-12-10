import notifee, {
  AndroidCategory,
  AndroidImportance,
} from "@notifee/react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import {
  isExpoNotificationStreamVideoEvent,
  oniOSExpoNotificationEvent,
} from "@stream-io/video-react-native-sdk";
import { RevenueCat } from "components/RevenueCat";
import * as Notifications from "expo-notifications";
import { Slot, useRouter } from "expo-router";
import { getStreamUserToken } from "firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { StreamChat } from "stream-chat";
import { setNotifeeListeners } from "utils/setNotifeeListeners";
import { setPushConfig } from "utils/setPushConfig";
import { setPushMessageListeners } from "utils/setPushMessageHandlers";
import { auth } from "../firebase";

setPushConfig();
setNotifeeListeners();
setPushMessageListeners();

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
});

type OnNotifeeMessageReceived = (
  message: FirebaseMessagingTypes.RemoteMessage
) => Promise<any>;

function useNotificationObserver() {
  const router = useRouter();
  const onMessage = async (message: FirebaseMessagingTypes.RemoteMessage) => {
    console.log("onMessage", message);
    const callCid = message.data?.call_cid as string;
    if (!callCid) {
      console.error("No call cid found in message");
      return;
    }
    const [_callType, callId] = callCid.split(":");
    console.log("[onMessage] Navigating to call with cid:", callId);
    // router.replace(`/home/${callId}`);
    // return onNotifeeMessageReceived(message);
  };

  // https://arc.net/l/quote/nigntfjt
  const onNotifeeMessageReceived: OnNotifeeMessageReceived = async (
    remoteMessage
  ) => {
    console.log("onNotifeeMessageReceived", remoteMessage);

    const userId = remoteMessage.data?.receiver_id as string;
    const callCid = remoteMessage.data?.call_cid as string;

    if (!userId) {
      console.error("No user id found in message");
      return;
    }

    if (!callCid) {
      console.error("No call cid found in message");
      return;
    }

    const client = StreamChat.getInstance(
      // @ts-ignore
      process.env.EXPO_PUBLIC_STREAM_API_KEY
    );
    client
      ._setToken(
        {
          id: userId,
        },
        getStreamUserToken
      )
      .then(() => {
        console.log("set token");
      })
      .catch((error) => {
        console.error("error with client._setToken", error);
      });

    // handle the message
    // const message = await client.getMessage(callCid);
    // create the android channel to send the notification to
    const channelId = await notifee.createChannel({
      id: "stream_call_notifications",
      name: "Calls",
      sound: "ringtone",
    });

    // display the notification
    const { stream, ...rest } = remoteMessage.data ?? {};
    const data = {
      ...rest,
      ...((stream as unknown as Record<string, string> | undefined) ?? {}), // extract and merge stream object if present
    };
    await notifee.displayNotification({
      id: "stream_call_notifications",
      // title: 'New call from ' + message.message.user?.name,
      title: "New call",
      // body: message.message.text,
      data,
      ios: {
          sound:"ringtone.wav"
      },
      android: {
        channelId: "stream_call_notifications",
        importance: AndroidImportance.HIGH,
        fullScreenAction: {
          id: "default",
        },
        category: AndroidCategory.CALL,
        loopSound: true,
        sound: "ringtone",
        // add a press action to open the app on press
        pressAction: {
          id: "default",
        },
      },
    });
  };

  const backgroundMessageHandler: (
    message: FirebaseMessagingTypes.RemoteMessage
  ) => Promise<any> = async (message) => {
    console.log(
      "[app/_layout] useNotificationObserver backgroundMessageHandler message: ",
      message
    );
    await notifee.displayNotification({
      title: "TITLE",
      body: "BODY",
      android: {
        channelId: "default-channel-id",
      },
    });
    console.log("displayed notification");
    return true;
  };

  // this stuff is old, new version is in utils/setPushMessageHandlers.ts
  // messaging().setBackgroundMessageHandler
  const onMessageUnsubscribe = messaging().onMessage(onMessage);
  messaging().setBackgroundMessageHandler(onNotifeeMessageReceived);
  // messaging().setBackgroundMessageHandler(backgroundMessageHandler);

  notifee.onBackgroundEvent(async (event) =>
    console.log("[notifee.onBackgroundEvent]", event)
  );
  return onMessageUnsubscribe;
}

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useNotificationObserver();

  useEffect(() => {
    if (Platform.OS === "ios") {
      const subscription = Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log(
            "Notifications.addNotificationReceivedListener",
            notification
          );
          if (isExpoNotificationStreamVideoEvent(notification)) {
            oniOSExpoNotificationEvent(notification);
          } else {
            // your other notifications (if any)
          }
        }
      );
      return () => {
        subscription.remove();
      };
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      <RevenueCat>
        {/* <OverlayProvider> */}
        <Slot />
        {/* </OverlayProvider> */}
      </RevenueCat>
    </AuthContext.Provider>
  );
}
