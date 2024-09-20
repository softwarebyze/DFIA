import { StatusBar } from "expo-status-bar";

import {
  Call,
  CallContent,
  CallingState,
  colorPallet,
  useCalls,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { analytics } from "analytics";
import { AngelOnly, NonAngelOnly } from "components/AngelOnly";
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
import { auth } from "../firebase";

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
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: 42, marginVertical: 30 }}>
                  Hi, {user.displayName}
                </Text>
                <AngelOnly>
                  <Badge>Angel</Badge>
                </AngelOnly>
              </View>
              <NonAngelOnly>
                <CallButton onPress={() => setScreen("call")} />
              </NonAngelOnly>
              <MyCallUI />
              {/* <AngelOnly> */}
                <Calls />
              {/* </AngelOnly> */}
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
                  <MyCallUI />
              </SafeAreaView>
            </StreamCall>
          )}
          <StatusBar style="auto" />
        </StreamVideo>
      )}
    </RevenueCat>
  );
}

const Calls = () => {
  // const client = useStreamVideoClient();
  // const [calls, setCalls] = useState<Call[]>([]);

  // useEffect(() => {
  //   const fetchCalls = async () => {
  //     const res = await client?.queryCalls({
  //       filter_conditions: { ongoing: true },
  //       watch: true,
  //     });
  //     if (!res) return;
  //     console.log(res.calls);
  //     setCalls(res.calls);
  //   };
  //   fetchCalls();
  // }, [client]);

  // listen to new calls that were created with the current user as a member
  // useEffect(() => {
  //   if (!client) {
  //     return;
  //   }
  //   analytics.track("settingUpCallListener");
  //   const unsubscribe = client.on("call.created", (e) => {
  //     analytics.track("call.created", e);
  //     const callResponse = e.call;
  //     setCalls((prevCalls) => {
  //       for (const c of prevCalls) {
  //         if (c.cid === callResponse.cid) {
  //           return prevCalls;
  //         }
  //       }
  //       const newCall = client.call(callResponse.type, callResponse.id);
  //       newCall.get();
  //       return [newCall, ...prevCalls];
  //     });
  //   });
  //   return unsubscribe;
  // }, [client]);
  const calls=useCalls();

  return (
    <View>
      <Text>Calls:</Text>
      {calls.map((call) => (
        <Text key={call.id}>{call.id}</Text>
      ))}
      {calls.length === 0 && <Text>No ongoing calls</Text>}
    </View>
  );
};

const Badge = ({ children }: { children: React.ReactNode }) => {
  return (
    <View
      style={{
        backgroundColor: colorPallet.dark.primary,
        borderRadius: 20,
        padding: 8,
      }}
    >
      <Text style={{ color: "white" }}>{children}</Text>
    </View>
  );
};


// import {  CallingState } from '@stream-io/video-react-sdk';

export const MyCallUI = () => {
  const calls = useCalls();

  // handle incoming ring calls
  const incomingCalls = calls.filter(
    (call) =>
      call.isCreatedByMe === false &&
      call.state.callingState === CallingState.RINGING,
  );

  const [incomingCall] = incomingCalls;
  if (incomingCall) {
    // render the incoming call UI
    return <MyIncomingCallUI call={incomingCall} />;
  }

  // handle outgoing ring calls
  const outgoingCalls = calls.filter(
    (call) =>
      call.isCreatedByMe === true &&
      call.state.callingState === CallingState.RINGING,
  );

  const [outgoingCall] = outgoingCalls;
  if (outgoingCall) {
    // render the outgoing call UI
    return <MyOutgoingCallUI call={outgoingCall} />;
  }

  return null;
};

const MyIncomingCallUI = ({ call }: {call: Call}) => {
  return (
    <View>
      <Text>Incoming call from {call.isCreatedByMe ? "me" : "not me"}</Text>
      <Button title="Accept" onPress={() => call.accept()} />
      <Button title="Decline" onPress={() => call.leave({reject: true})} />
    </View>
  );
};

const MyOutgoingCallUI = ({ call }: {call: Call}) => {
  return (
    <View>
      <Text>Calling {call.createdBy}</Text>
      <Button title="Cancel" onPress={() => call.cancel()} />
    </View>
  );
};