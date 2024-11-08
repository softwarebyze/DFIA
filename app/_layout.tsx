import notifee from "@notifee/react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import "expo-dev-client";
import { Slot, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { setPushConfig } from "utils/setPushConfig";
import { RevenueCat } from "~/components/RevenueCat";
import { auth, getStreamUserToken } from "~/firebase";
import { useColorScheme, useInitialAndroidBarSync } from "~/lib/useColorScheme";
import { NAV_THEME } from "~/theme";
import "../global.css";

setPushConfig();

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
    router.replace(`/home/${callId}`);
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
      id: "default-channel-id",
      name: "Calls",
    });

    // display the notification
    const { stream, ...rest } = remoteMessage.data ?? {};
    const data = {
      ...rest,
      ...((stream as unknown as Record<string, string> | undefined) ?? {}), // extract and merge stream object if present
    };
    await notifee.displayNotification({
      // title: 'New call from ' + message.message.user?.name,
      title: "New call",
      // body: message.message.text,
      data,
      android: {
        channelId,
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

  // messaging().setBackgroundMessageHandler
  const onMessageUnsubscribe = messaging().onMessage(onMessage);
  messaging().setBackgroundMessageHandler(onNotifeeMessageReceived);
  // messaging().setBackgroundMessageHandler(backgroundMessageHandler);

  notifee.onBackgroundEvent(async (event) =>
    console.log("[notifee.onBackgroundEvent]", event)
  );
  return onMessageUnsubscribe;
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useNotificationObserver();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? "light" : "dark"}`}
        style={isDarkColorScheme ? "light" : "dark"}
      />

      <NavThemeProvider value={NAV_THEME[colorScheme]}>
        <AuthContext.Provider value={{ user, isLoading }}>
          <RevenueCat>
            {/* <OverlayProvider> */}
            <Slot />
            {/* </OverlayProvider> */}
          </RevenueCat>
        </AuthContext.Provider>
      </NavThemeProvider>
    </>
  );
}
