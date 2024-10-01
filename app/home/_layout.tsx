// app/home/_layout.tsx
import notifee from "@notifee/react-native";
import NotificationsProvider from "components/NotificationsProvider";
import { StreamVideo } from "components/StreamVideo";
import { Slot, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../_layout";

export default function AuthenticatedLayout() {
  console.log("authenticated layout");
  const { user, isLoading } = useContext(AuthContext);
  console.log({ user, isLoading });
  const router = useRouter();

  useEffect(() => {
    const registerPushToken = async () => {
      const res = await notifee.requestPermission();
      console.log(res);
      // const token = await messaging().getToken();
      // console.log("token", token);
      //   await messaging().requestPermission();
      //   if (!messaging().isDeviceRegisteredForRemoteMessages) {
      //     console.log("!messaging().isDeviceRegisteredForRemoteMessages");
      //     await messaging().registerDeviceForRemoteMessages();
      //   }
      //   let token = null;
      //   try {
      //     token = await messaging().getToken();
      //   } catch (error) {
      //     console.error(error);
      //   }
      //   if (!token) {
      //     console.warn("No token");
      //     return;
      //   }

      //   const push_provider: PushProvider = Platform.select({
      //     ios: "apn",
      //     android: "firebase",
      //     web: "firebase",
      //     macos: "apn",
      //     windows: "firebase",
      //     native: "firebase",
      //   });
      //   const push_provider_name = "admin_sdk_services_key"; // name an alias for your push provider (optional)

      //   if (token) {
      //     await AsyncStorage.setItem("@current_push_token", token);
      //     try {
      //       await client.addDevice(
      //         token,
      //         push_provider,
      //         user?.uid,
      //         // push_provider_name is meant for optional multiple providers support, see: https://getstream.io/chat/docs/react/push_providers_and_multi_bundle
      //         push_provider_name
      //       );
      //     } catch (error) {}
      //   }

      //   const removeOldToken = async () => {
      //     const oldToken = await AsyncStorage.getItem("@current_push_token");
      //     if (oldToken !== null) {
      //       await client.removeDevice(oldToken);
      //     }
      //   };

      //   unsubscribeTokenRefreshListenerRef.current = messaging().onTokenRefresh(
      //     async (newToken) => {
      //       console.log("onTokenRefresh");
      //       await Promise.all([
      //         removeOldToken(),
      //         client.addDevice(
      //           newToken,
      //           push_provider,
      //           auth().currentUser?.uid,
      //           push_provider_name
      //         ),
      //         AsyncStorage.setItem("@current_push_token", newToken),
      //       ]);
      //     }
      //   );
    };

    const init = async () => {
      await registerPushToken();
    };

    init();

    // return () => {
    //   console.log("unsubscribing from messaging");
    //   unsubscribeTokenRefreshListenerRef.current?.();
    // };
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      // If not authenticated, redirect to sign-in
      router.replace("/");
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    // Optionally display a loading indicator
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StreamVideo user={user}>
      <NotificationsProvider>
        <Slot />
      </NotificationsProvider>
    </StreamVideo>
  );
}
