import { StatusBar } from "expo-status-bar";

import { CallContent, colorPallet } from "@stream-io/video-react-native-sdk";
import { analytics } from "analytics";
import { CallButton } from "components/CallButton";
import { CallInfo } from "components/CallInfo";
import { RevenueCat } from "components/RevenueCat";
import { Screen } from "components/Screen";
import { SignIn } from "components/SignIn";
import { StreamCall } from "components/StreamCall";
import { StreamVideo } from "components/StreamVideo";
import { FirebaseError } from "firebase/app";
import {
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signOut,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  AlertButton,
  Button,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { auth } from "./firebase";

export default function App() {
  const [screen, setScreen] = useState<"welcome" | "call">("welcome");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    analytics.track("useEffect", {});
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      analytics.track("onAuthStateChanged", { user });
      setUser(user);
    });
    return unsubscribe;
  }, []);

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
                  const reauthenticatedUser =
                    await reauthenticateWithCredential(
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

  return (
    <RevenueCat>
      {!user ? (
        <Screen>
          <Text
            style={{
              color: colorPallet.dark.primary,
              fontSize: 48,
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            DFIA
          </Text>
          <Text
            style={{
              color: colorPallet.dark.secondary,
              fontSize: 24,
              marginBottom: 28,
            }}
          >
            Don't Face It Alone
          </Text>
          <SignIn />
        </Screen>
      ) : (
        <StreamVideo user={user}>
          {screen === "welcome" ? (
            <Screen style={{ gap: 20, justifyContent: "space-between" }}>
              <Text style={{ fontSize: 42, marginVertical: 30 }}>
                Hi, {user.displayName}
              </Text>
              <CallButton onPress={() => setScreen("call")} />
              <View style={{ gap: 22, marginVertical: 40 }}>
                <Button title="Sign out" onPress={() => signOut(auth)} />
                <Button
                  title="Delete account"
                  onPress={() => deleteAccount(user)}
                  color={colorPallet.dark.error}
                />
              </View>
            </Screen>
          ) : (
            <StreamCall callId={user.uid}>
              <SafeAreaView style={{ flex: 1 }}>
                <CallInfo />
                <CallContent onHangupCallHandler={() => setScreen("welcome")} />
              </SafeAreaView>
            </StreamCall>
          )}
          <StatusBar style="auto" />
        </StreamVideo>
      )}
    </RevenueCat>
  );
}
