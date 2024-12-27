import React, { useCallback } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import {
  CallingState,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import AppColors from "constants/app.colors";
export const IncomingCallButtonGroup = (props: {
  callAccepted: () => void;
  callFail: () => void;
}) => {
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const acceptCallHandler = useCallback(async () => {
    try {
      props.callAccepted();
    } catch (error) {
      props.callFail();
    }
  }, [call]);
  const rejectCallHandler = useCallback(async () => {
    try {
      if (callingState === CallingState.LEFT) {
        props.callFail();
        return;
      }
      await call?.leave({ reject: true, reason: "decline" });
      props.callFail();
    } catch (error) {
      props.callFail();
    }
  }, [call, callingState]);

  return (
    <View style={styles.buttonGroup}>
      <Pressable
        style={[styles.button, styles.rejectButton]}
        onPress={rejectCallHandler}>
        <Text style={styles.callButtonText}>Reject</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.acceptButton]}
        onPress={acceptCallHandler}>
        <Text style={styles.callButtonText}>Accept</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: AppColors.acceptGreen,
  },
  rejectButton: {
    backgroundColor: AppColors.rejectRed,
  },
  callButtonText: {
    color: "white",
    textAlign: "center",
  },
});
