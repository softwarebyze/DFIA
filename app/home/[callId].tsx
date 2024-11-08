// app/home/[callId].tsx
import {
  CallContent,
  CallingState,
  JoinCallButton,
  Lobby,
  RingingCallContent,
  useCall,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { CallInfo } from "components/CallInfo";
import { StreamCall } from "components/StreamCall";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Text } from '~/components/nativewindui/Text';
import { SafeAreaView } from "react-native";
import { AuthContext } from "../_layout";

const angelUserIds = ["vmljsmXYDBMloSozpWUxZSQdSHj2"];

export default function Call() {
  const { user } = useContext(AuthContext);
  console.log("[Call] user.displayName: ", user?.displayName);
  const router = useRouter();
  const { callId } = useLocalSearchParams();
  console.log("[callId] callId from params: ", callId);

  if (!user) {
    console.log("User not found, redirecting to home");
    router.replace("/");
    return null;
  }

  if (!callId || typeof callId !== "string") {
    // Handle the case where callId is missing or invalid
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Invalid call ID</Text>
      </SafeAreaView>
    );
  }

  return (
    <StreamCall callId={callId}>
      <SafeAreaView style={{ flex: 1 }}>
        <CallInfo />
        <CallPreview />
      </SafeAreaView>
    </StreamCall>
  );
}

const CallPreview = () => {
  const call = useCall();
  // const callState = call?.state.callingState;
  const { useCallCallingState, useParticipants, useCallMembers } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();
  const client = useStreamVideoClient()!;

  useEffect(() => {
    console.log("[CallPreview] callingState: ", callingState);
  }, [callingState]);

  return (
    <>
      <Text>Call Status: {call?.state.callingState}</Text>
      {callingState === CallingState.IDLE && (
        <Lobby
          JoinCallButton={() => (
            <JoinCallButton
              onPressHandler={async () => {
                const isAngel = angelUserIds.includes(
                  client.streamClient.userID!
                );
                if (isAngel) {
                  await call?.join();
                  return;
                }
                console.log("[StreamCall] isAngel: ", isAngel);
                const members = [
                  { user_id: client.streamClient.userID! },
                  { user_id: "vmljsmXYDBMloSozpWUxZSQdSHj2" },
                ];
                console.log("callId: ", call?.id);
                await call?.getOrCreate({
                  ring: true,
                  data: {
                    members,
                  },
                });
              }}
            />
          )}
        />
      )}

      {callingState === CallingState.RINGING && <RingingCallContent />}
      {callingState === CallingState.JOINED && (
        <CallContent
          onHangupCallHandler={() => {
            console.log("hangup call");
            // call?.leave();
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/");
            }
          }}
        />
      )}
      {callingState === CallingState.LEFT && <Text>Left call</Text>}
    </>
  );
};
