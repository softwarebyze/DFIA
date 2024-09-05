import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// Import the functions you need from the SDKs you need
import { analytics } from "analytics";
import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // @ts-ignore
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  // @ts-ignore
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  // @ts-ignore
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID!,
  // @ts-ignore
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET!,
  // @ts-ignore
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID!,
  // @ts-ignore
  appId: process.env.EXPO_PUBLIC_APP_ID!,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const getStreamUserToken = async () => {
  analytics.track("getStreamUserToken", {});
  const tokenResponse = await httpsCallable(
    functions,
    "ext-auth-chat-getStreamUserToken"
  )();
  return tokenResponse.data?.toString() as string;
};

export const signIn = async (email: string, password: string) => {
  analytics.track("signIn", { email });
  return signInWithEmailAndPassword(auth, email, password);
};
