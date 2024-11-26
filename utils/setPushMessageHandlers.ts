import messaging from '@react-native-firebase/messaging';
import {
  isFirebaseStreamVideoMessage,
  firebaseDataHandler,
} from '@stream-io/video-react-native-sdk';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

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
  // Set up the foreground message handler for Android
  messaging().onMessage((msg) => {
    console.log("messaging().onMessage", msg);
    if (isFirebaseStreamVideoMessage(msg)) {
      firebaseDataHandler(msg.data);
    } else {
      // your other messages (if any)
    }
  });

  if (Platform.OS === 'ios') {
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
