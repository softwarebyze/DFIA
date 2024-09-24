// https://arc.net/l/quote/huhyibgu
// @ts-ignore
const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;

import { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    StreamVideoClient,
    StreamVideoRN,
} from '@stream-io/video-react-native-sdk';
import { getStreamUserToken } from 'firebase';
//   import { STREAM_API_KEY } from '../../constants';
//   import { staticNavigateToRingingCall } from './staticNavigationUtils';
  
  export function setPushConfig() {
    StreamVideoRN.setPushConfig({
      // pass true to inform the SDK that this is an expo app
      isExpo: true,
      ios: {
        // add your push_provider_name for iOS that you have setup in Stream dashboard
        // pushProviderName: __DEV__ ? 'apn-video-staging' : 'apn-video-production',
        pushProviderName: "voip"
      },
      android: {
        // add your push_provider_name for Android that you have setup in Stream dashboard
        // pushProviderName: __DEV__
        //   ? 'firebase-video-staging'
        //   : 'firebase-video-production',
        pushProviderName: "firebase",
        // configure the notification channel to be used for incoming calls for Android.
        incomingCallChannel: {
          id: 'stream_incoming_call',
          name: 'Incoming call notifications',
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
          getBody: (_createdUserName: string) => 'Tap to answer the call',
        },
      },
      // add the callback to be executed a call is accepted, used for navigation
      navigateAcceptCall: () => {
        // staticNavigateToRingingCall();
        alert("Call Accepted");
      },
      // add the callback to be executed when a notification is tapped,
      // but the user did not press accept or decline, used for navigation
      navigateToIncomingCall: () => {
        // staticNavigateToRingingCall();
        alert("Navigated to Incoming Call");
      },
      // add the async callback to create a video client
      // for incoming calls in the background on a push notification
      createStreamVideoClient: async () => {
        // note that since the method is async,
        // you can call your server to get the user data or token or retrieve from offline storage.
        const userId = await AsyncStorage.getItem('@userId');
        const userName = await AsyncStorage.getItem('@userName');
        console.log("userId", userId);
        if (!userId) return undefined;
        // an example promise to fetch token from your server
        const user = { id: userId, name: userName ?? undefined };
        return new StreamVideoClient({
          apiKey: apiKey, // pass your stream api key
          user,
          tokenProvider: getStreamUserToken,
        });
      },
    });
  }