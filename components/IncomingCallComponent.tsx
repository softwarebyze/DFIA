// Incoming Calls
import React from "react";
import {
  CallingState,
  RingingCallContent,
  StreamCall,
  useCalls,
  useCallStateHooks,
  useConnectedUser,
  UserResponse,
} from "@stream-io/video-react-native-sdk";
import { Image, StyleSheet, Text, View, Modal } from "react-native";
import { CallCard } from "./CallCard";
import AppColors from "constants/app.colors";
import { IncomingCallInfo } from "./IncomingCallInfo";
import { IncomingCallButtonGroup } from "./IncomingCallButtonGroup";
import { MediaStreamButtonGroup } from "./MediaStreamButtonGroup";
import { Link, router } from "expo-router";

export const IncomingCallComponent = () => {
  const calls = useCalls();

  const incomingCalls = calls.filter(
    call =>
      call.isCreatedByMe === false &&
      call.state.callingState === CallingState.RINGING,
  );
  console.log("incomingCalls ", incomingCalls.length);
  const hasIncomingCall = incomingCalls.length > 0;

  if (!hasIncomingCall) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={hasIncomingCall}
      onRequestClose={() => {}}>
      <View style={[StyleSheet.absoluteFill, styles.container]}>
        {incomingCalls.length > 0 ? (
          <StreamCall key={incomingCalls[0]?.id} call={incomingCalls[0]}>
            <IncomingCallInfo />
            {incomingCalls[0]?.state.callingState === CallingState.RINGING && (
              <RingingCallContent />
            )}
          </StreamCall>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.modelBG,
    marginTop: 10,
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noPastCalls: {
    marginTop: 300,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: AppColors.black,
    textAlign: "center",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  memberTitle: {
    fontSize: 20,
    color: AppColors.white,
    marginVertical: 20,
    textAlign: "center",
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
});
