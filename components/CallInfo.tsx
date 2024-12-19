import React from "react";
import { useCall, useCallStateHooks } from "@stream-io/video-react-native-sdk";
import { Text, View, StyleSheet } from "react-native";

export const CallInfo = () => {
  const call = useCall();

  const { useCallCallingState, useParticipants, useCallMembers } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants() || [];
  const members = useCallMembers() || [];

  return (
    <View style={styles.container} accessible accessibilityLabel="Call Info">
      <Text style={styles.title}>Call Info</Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Call ID: </Text>
        {call?.cid || "N/A"}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>State: </Text>
        {callingState || "Unknown"}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Participants: </Text>
        {participants.length}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Members: </Text>
        {members.length}
      </Text>
      {members.length > 0 && (
        <View style={styles.membersList}>
          {members.map(member => (
            <Text key={member.user_id} style={styles.memberName}>
              {member.user?.name || "Unnamed User"}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    marginVertical: 2,
  },
  label: {
    fontWeight: "bold",
  },
  membersList: {
    marginTop: 10,
  },
  memberName: {
    fontSize: 14,
    marginVertical: 1,
    paddingLeft: 10,
    color: "#555",
  },
});
