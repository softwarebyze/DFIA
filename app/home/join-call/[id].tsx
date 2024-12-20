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
import { IncomingCallInfo } from "components/IncomingCallInfo";
import { StreamCall } from "components/StreamCall";
import AppColors from "constants/app.colors";
import { AuthContext } from "context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Alert, Text, View } from "react-native";

const CallPreview = () => {
  const { user } = useContext(AuthContext);
  const call = useCall();

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
    try {
      await call?.join();
    } catch (error) {
      Alert.alert("DFIA", "Something went wrong");
    }
  };

  const leaveOrEndCall = async () => {
    if (callingState === CallingState.JOINED && createdBy?.id === user?.uid) {
      await call?.endCall().catch(() => console.log("Failed to end call."));
    } else {
      await call?.leave().catch(() => console.log("Failed to leave call."));
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
    getCallDetails();
  }, [callingState]);

  const getCallDetails = async () => {
    try {
      await call?.get();
    } catch (error) {
      Alert.alert("DFIA", "Something went wrong");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {callingState === CallingState.IDLE && (
        <Lobby
          JoinCallButton={() => <JoinCallButton onPressHandler={joinCall} />}
        />
      )}
      {callingState === CallingState.RINGING && <RingingCallContent />}
      {callingState === CallingState.JOINING && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {callingState === CallingState.JOINED && (
        <CallContent onHangupCallHandler={leaveOrEndCall} />
      )}
      {callingState === CallingState.RECONNECTING && (
        <View style={styles.loadingContainer}>
          <Text style={styles.nameTitle}>Reconnecting...</Text>
        </View>
      )}
      {callingState === CallingState.OFFLINE && (
        <View style={styles.loadingContainer}>
          <Text style={styles.nameTitle}>OFFLINE...</Text>
        </View>
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.callBG,
  },
  nameTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: AppColors.white,
  },
});
