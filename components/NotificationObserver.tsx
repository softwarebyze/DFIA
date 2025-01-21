import React, { useEffect } from "react";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import {
  isExpoNotificationStreamVideoEvent,
  oniOSExpoNotificationEvent,
} from "@stream-io/video-react-native-sdk";

export const NotificationObserver: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    // iOS Notification Listener
    if (Platform.OS === "ios") {
      const subscription = Notifications.addNotificationReceivedListener(
        notification => {
          if (isExpoNotificationStreamVideoEvent(notification)) {
            oniOSExpoNotificationEvent(notification);
          } else {
            // your other notifications (if any)
          }
        },
      );

      return () => {
        subscription.remove();
      };
    }
  }, []);

  useEffect(() => {
    // Foreground Message Listener
    const unsubscribe = messaging().onMessage(async message => {
      // Handle foreground notification
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Background Message Handler
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   await notifee.displayNotification({
    //     title: "New Notification",
    //     body: remoteMessage.notification?.body ?? "No body",
    //     android: {
    //       channelId: "default-channel",
    //     },
    //   });
    // });
    // Set up the background message handler
    // messaging().setBackgroundMessageHandler(async msg => {
    //   if (isFirebaseStreamVideoMessage(msg)) {
    //     await firebaseDataHandler(msg.data);
    //   } else {
    //     // your other background notifications (if any)
    //   }
    // });
  }, []);

  return <>{children}</>;
};
