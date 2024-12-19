const BACKGROUND_NOTIFICATION_TASK =
  "STREAM-VIDEO-BACKGROUND-NOTIFICATION-TASK";

import {
  isFirebaseStreamVideoMessage,
  firebaseDataHandler,
  isExpoNotificationStreamVideoEvent,
} from "@stream-io/video-react-native-sdk";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

export const setPushMessageHandlers = () => {
  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
    console.log("BACKGROUND_NOTIFICATION_TASK", data);
    if (error) {
      return;
    }
    // @ts-ignore
    const dataToProcess = data.notification?.data;
    if (data?.sender === "stream.video") {
      firebaseDataHandler(dataToProcess);
    }
  });
  // background handler (does not handle on app killed state)
  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  Notifications.setNotificationHandler({
    handleNotification: async notification => {
      if (
        Platform.OS === "android" &&
        isExpoNotificationStreamVideoEvent(notification)
      ) {
        const data = notification?.request?.trigger?.remoteMessage?.data!;
        await firebaseDataHandler(data);
        // do not show this message, it processed by the above handler
        return {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      } else {
        // configuration for iOS call notification && your other messages, example below to show alert and play sound
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      }
    },
  });
};
