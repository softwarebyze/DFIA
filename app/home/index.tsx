// app/home/index.tsx
import notifee, { AndroidImportance } from "@notifee/react-native";
import { colorPallet } from "@stream-io/video-react-native-sdk";
import { analytics } from "analytics";
import { CallButton } from "components/CallButton";
import { Calls } from "components/Calls";
import { Screen } from "components/Screen";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  User,
} from "firebase/auth";
import { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  AlertButton,
  Button,
  Text,
  View,
} from "react-native";
import { auth } from "../../firebase";
import { AuthContext } from "../_layout";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationDemoButton = () => (
  <Button
    title="Show Notification"
    onPress={async () => {
      const title = "Notification Title";
      const message = { message: { text: "This is a notification message" } };
      const remoteMessage = { data: {} };
      const channelId = "default-channel-id";

      await notifee.displayNotification({
        title,
        body: message.message.text,
        data: remoteMessage.data,
        android: {
          channelId,
          pressAction: {
            id: "default",
          },
          importance: AndroidImportance.HIGH,
        },
      });
    }}
  />
);

const deleteAccount = async (user: User) => {
  analytics.track("deleteAccount", { user });
  try {
    await deleteUser(user);
  } catch (err) {
    if (err instanceof FirebaseError) {
      if (err.code === "auth/requires-recent-login") {
        return Alert.prompt(
          "Confirm your password to delete account",
          user.email || "",
          [
            {
              text: "Cancel",
              onPress(password) {
                analytics.track("deleteAccountCancelled", { password });
              },
            },
            {
              text: "Delete",
              style: "destructive",
              async onPress(password) {
                if (!password) {
                  analytics.track("deleteAccountError", {
                    err: "no password",
                  });
                  return;
                }
                if (!user.email) {
                  analytics.track("deleteAccountError", {
                    err: "no email",
                  });
                  throw new Error("no email");
                }
                const reauthenticatedUser = await reauthenticateWithCredential(
                  user,
                  EmailAuthProvider.credential(user.email, password)
                );
                deleteUser(reauthenticatedUser.user);
              },
            },
          ] satisfies ((text: string) => void) | AlertButton[]
        );
      }
    }

    analytics.track("deleteAccountError", { err });
    console.error(err);
  }
};

export default function Home() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading]);

  if (isLoading) {
    // Optionally display a loading indicator
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const getNewCallId = () => `${Date.now()}-${user?.displayName}`;

  return (
    <Screen style={{ gap: 20, justifyContent: "space-between" }}>
      <Text style={{ fontSize: 42, marginVertical: 30 }}>
        Hi, {user?.displayName}
      </Text>
      <CallButton onPress={() => router.push(`/home/${getNewCallId()}`)} />
      <Calls />
      <View style={{ gap: 22, marginVertical: 40 }}>
        <Button title="Sign out" onPress={() => signOut(auth)} />
        <Button
          title="Delete account"
          onPress={() => deleteAccount(user!)} // Non-null assertion since user is non-null here
          color={colorPallet.dark.error}
        />
      </View>
    </Screen>
  );
}
