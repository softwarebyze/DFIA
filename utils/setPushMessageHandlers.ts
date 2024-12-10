import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import {
  isFirebaseStreamVideoMessage,
  firebaseDataHandler,
  onAndroidNotifeeEvent,
  isNotifeeStreamVideoEvent,
} from "@stream-io/video-react-native-sdk";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export const setPushMessageListeners = () => {
  // Set up the background message handler for Android
  messaging().setBackgroundMessageHandler(async (msg) => {
    console.log("messaging().setBackgroundMessageHandler", msg);
    if (isFirebaseStreamVideoMessage(msg)) {
      await firebaseDataHandler(msg.data);
    } else {
      // your other messages (if any)
    }
  });
  // on press handlers of background notifications
  notifee.onBackgroundEvent(async (event) => {
    if (isNotifeeStreamVideoEvent(event)) {
      await onAndroidNotifeeEvent({ event, isBackground: true });
    } else {
      // your other background notifications (if any)
    }
  });
  // Set up the foreground message handler for Android
  messaging().onMessage((msg) => {
    console.log("messaging().onMessage", msg);
    if (isFirebaseStreamVideoMessage(msg)) {
      firebaseDataHandler(msg.data);
    } else {
      // your other messages (if any)
    }
  });
  notifee.onForegroundEvent((event) => {
    if (isNotifeeStreamVideoEvent(event)) {
      onAndroidNotifeeEvent({ event, isBackground: false });
    } else {
      // your other foreground notifications (if any)
    }
  });
  if (Platform.OS === "ios") {
    // show notification on foreground on iOS
    Notifications.setNotificationHandler({
      // example configuration below to show alert and play sound
      handleNotification: async (notification) => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
};
