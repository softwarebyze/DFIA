import React from "react";
import { useCall, useCallStateHooks } from "@stream-io/video-react-native-sdk";
import { Text, View, StyleSheet } from "react-native";
import AppColors from "constants/app.colors";

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
      <View style={styles.row}>
        <Text style={styles.nameTitle}>Call ID: </Text>
        <Text style={styles.subtitle}>{call?.cid || "N/A"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.nameTitle}>State: </Text>
        <Text style={styles.subtitle}>{callingState || "Unknown"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.nameTitle}>Participants: </Text>
        <Text style={styles.subtitle}>{participants.length}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.nameTitle}>Members: </Text>
        <Text style={styles.subtitle}>{members.length}</Text>
      </View>
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
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.black,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: AppColors.black,
    flex: 1,
    textAlign: "right",
    paddingRight: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 1,
    borderBottomColor: AppColors.disable,
    borderBottomWidth: 1,
    padding: 5,
  },
  nameTitle: {
    fontWeight: "bold",
    fontSize: 18,
    flex: 1,
    paddingLeft: 6,
  },
  info: {
    fontSize: 14,
    marginVertical: 2,
  },
  membersList: {
    marginTop: 10,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 1,
    borderBottomColor: AppColors.disable,
    borderBottomWidth: 1,
    padding: 5,
  },
  memberName: {
    marginVertical: 1,
    fontSize: 18,
    color: AppColors.black,
    // textAlign: "right",
    paddingRight: 6,
  },
});
