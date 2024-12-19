import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import {
  isFirebaseStreamVideoMessage,
  firebaseDataHandler,
  onAndroidNotifeeEvent,
  isNotifeeStreamVideoEvent,
} from "@stream-io/video-react-native-sdk";
import { router } from "expo-router";

export const setFirebaseListeners = () => {
  // Set up the background message handler
  messaging().setBackgroundMessageHandler(async msg => {
    console.log("Background Notification call from firebase:", msg);
    if (isFirebaseStreamVideoMessage(msg)) {
      await firebaseDataHandler(msg.data);
    } else {
      // your other background notifications (if any)
    }
  });

  // on press handlers of background notifications
  notifee.onBackgroundEvent(async event => {
    console.log(
      "notifee Background Notification call from firebase:",
      event.detail.notification,
    );

    const callId = event.detail.notification?.id?.split(":")[1];
    if (isNotifeeStreamVideoEvent(event)) {
      // onAndroidNotifeeEvent({ event, isBackground: false });
      await onAndroidNotifeeEvent({ event, isBackground: true });
      if (event.detail.pressAction?.id == "accept") {
        router.navigate(`/home/join-call/${callId}`);
      }
    } else {
      // your other foreground notifications (if any)
    }
  });

  // Optionally: set up the foreground message handler
  messaging().onMessage(msg => {
    if (isFirebaseStreamVideoMessage(msg)) {
      firebaseDataHandler(msg.data);
    } else {
      // your other foreground notifications (if any)
    }
  });
  //  Optionally: on press handlers of foreground notifications
  notifee.onForegroundEvent(event => {
    const callId = event.detail.notification?.id?.split(":")[1];
    if (isNotifeeStreamVideoEvent(event)) {
      onAndroidNotifeeEvent({ event, isBackground: false });
      if (event.detail.pressAction?.id == "accept") {
        router.navigate(`/home/join-call/${callId}`);
      }
    } else {
      // your other foreground notifications (if any)
    }
  });
};
