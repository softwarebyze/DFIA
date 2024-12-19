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
import { StreamCall } from "components/StreamCall";
import { AuthContext } from "context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import { useEffect } from "react";
import { Text, View } from "react-native";

const CallPreview = () => {
  const { user } = useContext(AuthContext);
  const call = useCall();
  // const callState = call?.state.callingState;
  const {
    useCallCallingState,
    useParticipants,
    useCallMembers,
    useCallCreatedBy,
  } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();
  const createdBy = useCallCreatedBy();
  const client = useStreamVideoClient()!;
  const participants = useParticipants();
  const members = useCallMembers();

  const joinCall = async () => {
    call?.join();
  };

  const leaveOrEndCall = async () => {
    if (callingState === CallingState.JOINED && createdBy?.id === user?.uid) {
      await call?.endCall();
    } else {
      await call?.leave();
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      router.back();
    }
  }, [callingState]);
  console.log("callingState :: ", callingState);
  console.log("call state :: ", call?.state.callingState);
  return (
    <View style={{ flex: 1 }}>
      {callingState === CallingState.IDLE && (
        <Lobby
          JoinCallButton={() => <JoinCallButton onPressHandler={joinCall} />}
        />
      )}

      {callingState === CallingState.RINGING && <RingingCallContent />}
      {callingState === CallingState.JOINED && (
        <CallContent onHangupCallHandler={leaveOrEndCall} />
      )}
    </View>
  );
};

const JoinCall = () => {
  const { id } = useLocalSearchParams();

  return (
    <StreamCall callId={id as string}>
      <CallPreview />
    </StreamCall>
  );
};

export default JoinCall;
