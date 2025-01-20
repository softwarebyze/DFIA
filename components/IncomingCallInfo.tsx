import React from "react";
import {
  useCall,
  useCallStateHooks,
  useConnectedUser,
  UserResponse,
} from "@stream-io/video-react-native-sdk";
import { Image, Text, View, StyleSheet } from "react-native";
import AppColors from "constants/app.colors";

export const IncomingCallInfo = () => {
  const call = useCall();

  const { useCallCallingState, useParticipants, useCallMembers } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants() || [];
  const members = useCallMembers() || [];
  const connectedUser = useConnectedUser();
  const membersToShow: UserResponse[] = (members || [])
    .map(({ user }) => user)
    .filter(user => user.id !== connectedUser?.id);

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        {membersToShow.length > 0 && (
          <View style={styles.membersList}>
            {membersToShow.map(member => (
              <View key={member.id}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri: member.image,
                  }}
                />
                <Text style={styles.memberName}>
                  {member.name || "Unnamed User"}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
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
    fontSize: 14,
    marginVertical: 1,
    paddingTop: 10,
    color: AppColors.white,
    textAlign: "center",
  },
  membersList: {
    marginTop: 10,
  },
  memberName: {
    fontSize: 14,
    marginVertical: 1,
    paddingTop: 10,
    color: AppColors.white,
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
    backgroundColor: AppColors.grey,
  },
});
