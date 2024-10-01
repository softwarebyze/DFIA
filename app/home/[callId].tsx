// app/home/[callId].tsx
import {
  CallContent,
  useConnectedUser,
} from "@stream-io/video-react-native-sdk";
import { CallInfo } from "components/CallInfo";
import { StreamCall } from "components/StreamCall";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import { SafeAreaView, Text } from "react-native";
import { AuthContext } from "../_layout";

export default function Call() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { callId } = useLocalSearchParams();

  if (!user) {
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
  const connectedUser = useConnectedUser();
  console.log("devices: ", connectedUser?.devices);

  return (
    <StreamCall callId={callId}>
      <SafeAreaView style={{ flex: 1 }}>
        <CallInfo />
        {/* <RingingCallContent /> */}
        <CallContent
          onHangupCallHandler={() => {
            console.log("hangup call");
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/");
            }
          }}
        />
      </SafeAreaView>
    </StreamCall>
  );
}
