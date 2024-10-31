// https://arc.net/l/quote/huhyibgu
// @ts-ignore
const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;

import { AndroidImportance } from "@notifee/react-native";
import {
  StreamVideoClient,
  StreamVideoRN,
} from "@stream-io/video-react-native-sdk";
import { auth, getStreamUserToken } from "firebase";
import {
  staticNavigateToCall,
  staticNavigateToRingingCall,
} from "./staticNavigation";

export function setPushConfig() {
  StreamVideoRN.setPushConfig({
    isExpo: true,
    ios: {
      // add your push_provider_name for iOS that you have setup in Stream dashboard
      // pushProviderName: __DEV__ ? 'apn-video-staging' : 'apn-video-production',
      pushProviderName: "voip",
    },
    android: {
      // add your push_provider_name for Android that you have setup in Stream dashboard
      // pushProviderName: __DEV__
      //   ? 'firebase-video-staging'
      //   : 'firebase-video-production',
      pushProviderName: "firebase",
      // configure the notification channel to be used for incoming calls for Android.
      incomingCallChannel: {
        id: "stream_incoming_call",
        name: "Incoming call notifications",
        // This is the advised importance of receiving incoming call notifications.
        // This will ensure that the notification will appear on-top-of applications.
        importance: AndroidImportance.HIGH,
        // optional: if you dont pass a sound, default ringtone will be used
        // sound: <your sound url>
      },
      // configure the functions to create the texts shown in the notification
      // for incoming calls in Android.
      incomingCallNotificationTextGetters: {
        getTitle: (createdUserName: string) =>
          `Incoming call from ${createdUserName}`,
        getBody: (_createdUserName: string) => "Tap to answer the call",
      },
    },
    // add the callback to be executed a call is accepted, used for navigation
    navigateAcceptCall: () => {
      console.log("[navigateAcceptCall] Call Accepted");
      staticNavigateToCall();
      console.log("[navigateAcceptCall] Navigated to Call");
    },
    // add the callback to be executed when a notification is tapped,
    // but the user did not press accept or decline, used for navigation
    navigateToIncomingCall: () => {
      console.log("[navigateToIncomingCall] Navigated to Incoming Call");
      staticNavigateToRingingCall();
    },
    // add the async callback to create a video client
    // for incoming calls in the background on a push notification
    createStreamVideoClient: async () => {
      console.log("createStreamVideoClient");
      // note that since the method is async,
      // you can call your server to get the user data or token or retrieve from offline storage.
      const { currentUser } = auth;
      const userId = currentUser?.uid;
      const userName = currentUser?.displayName;
      console.log("userId", userId);
      if (!userId) return undefined;
      const user = { id: userId, name: userName ?? undefined };
      return StreamVideoClient.getOrCreateInstance({
        apiKey, // pass your stream api key
        user,
        tokenProvider: getStreamUserToken,
      });
    },
    onTapNonRingingCallNotification: () => {
      console.log("[onTapNonRingingCallNotification]");
    },
  });
}
