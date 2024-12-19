// https://arc.net/l/quote/huhyibgu
// @ts-ignore
const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;

import { AndroidImportance } from "@notifee/react-native";
import {
  StreamVideoClient,
  StreamVideoRN,
} from "@stream-io/video-react-native-sdk";
import { auth, getStreamUserToken } from "firebase";

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
      // ** i changed incomingCallChannel to callChannel but i think this is only for non-ringing calls
      // and i think we need to add incomingCallChannel back also
      incomingCallChannel: {
        id: "stream_call_notifications",
        name: "Call notifications",
        // This importance will ensure that the notification will appear on-top-of applications.
        importance: AndroidImportance.HIGH,
        sound: "ringtone",
      },
      // configure the functions to create the texts shown in the notification
      // for non ringing calls in Android.
      // ** same here, i changed incomingCallNotificationTextGetters to callNotificationTextGetters
      // but i think we need to add incomingCallNotificationTextGetters back also for ringing calls
      // callNotificationTextGetters: {
      //   getTitle(type, createdUserName) {
      //     if (type === "call.live_started") {
      //       return `Call went live, it was started by ${createdUserName}`;
      //     } else {
      //       return `${createdUserName} is notifying you about a call`;
      //     }
      //   },
      //   getBody(_type, createdUserName) {
      //     return "Tap to open the call";
      //   },
      // },
      incomingCallNotificationTextGetters: {
        getTitle: (createdUserName: string) =>
          `Incoming call from ${createdUserName}`,
        getBody: (_createdUserName: string) => "Tap to answer the call",
      },
    },

    // optional: add the callback to be executed when a non ringing call notification is tapped
    // onTapNonRingingCallNotification: (call_cid: string, type: NonRingingPushEvent) => {
    //   const [callType, callId] = call_cid.split(':');
    //   if (callType === 'livestream') {
    //     staticNavigateToLivestreamCall();
    //   } else {
    //     staticNavigateToActiveCall();
    //   }
    // },
    // add the async callback to create a video client
    // for incoming calls in the background on a push notification
    createStreamVideoClient: async () => {
      console.log("createStreamVideoClient");
      // note that since the method is async,
      // you can call your server to get the user data or token or retrieve from offline storage.
      const { currentUser } = auth;
      console.log("currentUser", currentUser);
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
    // onTapNonRingingCallNotification: () => {
    //   console.log("[onTapNonRingingCallNotification]");
    // },
  });
}
