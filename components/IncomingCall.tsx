// Incoming Calls
import React from "react";
import {
  CallingState,
  StreamCall,
  useCalls,
} from "@stream-io/video-react-native-sdk";
import { StyleSheet, Text, View } from "react-native";
import { CallCard } from "./CallCard";
import AppColors from "constants/app.colors";

export const IncomingCalls = () => {
  const calls = useCalls();

  const incomingCalls = calls.filter(
    call =>
      call.isCreatedByMe === false &&
      call.state.callingState === CallingState.RINGING,
  );

  return (
    <View style={styles.container}>
      {incomingCalls.length > 0 ? (
        <View>
          <Text style={styles.title}>{"Incoming Call"}</Text>
          {incomingCalls.map(call => (
            <StreamCall key={call.id} call={call}>
              <CallCard />
            </StreamCall>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    marginTop: 10,
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
});
