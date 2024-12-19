import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { useCall, useCallStateHooks } from "@stream-io/video-react-native-sdk";
export const MediaStreamButtonGroup = () => {
  const call = useCall();
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { isMute: microphoneMuted } = useMicrophoneState();
  const { isMute: cameraMuted } = useCameraState();
  const audioButtonStyles = [
    styles.button,
    {
      backgroundColor: microphoneMuted == true ? "#080707dd" : "white",
    },
  ];
  const videoButtonStyles = [
    styles.button,
    {
      backgroundColor: cameraMuted == true ? "#080707dd" : "white",
    },
  ];
  const audioButtonTextStyles = [
    styles.mediaButtonText,
    {
      color: microphoneMuted == true ? "white" : "#080707dd",
    },
  ];
  const videoButtonTextStyles = [
    styles.mediaButtonText,
    {
      color: cameraMuted == true ? "white" : "#080707dd",
    },
  ];
  const toggleAudioMuted = async () => {
    await call?.microphone.toggle();
  };
  const toggleVideoMuted = async () => {
    await call?.camera.toggle();
  };
  return (
    <View style={styles.buttonGroup}>
      <Pressable onPress={toggleAudioMuted} style={audioButtonStyles}>
        {!microphoneMuted ? (
          <Text style={audioButtonTextStyles}>Audio on</Text>
        ) : (
          <Text style={audioButtonTextStyles}>Audio off</Text>
        )}
      </Pressable>
      <Pressable onPress={toggleVideoMuted} style={videoButtonStyles}>
        {!cameraMuted ? (
          <Text style={videoButtonTextStyles}>Video on</Text>
        ) : (
          <Text style={videoButtonTextStyles}>Video off</Text>
        )}
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
  mediaButtonText: {
    textAlign: "center",
  },
});
