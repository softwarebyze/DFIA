import React, { useContext, useEffect } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  CallingState,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import { Link, router } from "expo-router";
import AppColors from "constants/app.colors";
import { AppPNGs } from "constants/app.image";
import { AuthContext } from "context/AuthContext";

export const CallCard = () => {
  const call = useCall();
  const {
    useCallCallingState,
    useCallMembers,
    useCallCreatedAt,
    useParticipantCount,
    useCallCreatedBy,
  } = useCallStateHooks();

  const { user } = useContext(AuthContext);
  const callingState = useCallCallingState();
  const createdBy = useCallCreatedBy();
  const members = useCallMembers();
  const createdAt = useCallCreatedAt();
  const participantCount = useParticipantCount();

  if (!call) return null;

  console.log(call.id);
  useEffect(() => {
    //End Call if paticipant count 1 & created by my
    if (participantCount === 1 && createdBy?.id === user?.uid) {
      call.endCall();
    }

    return () => {};
  }, [call]);

  const onPress = () => {
    if (call) {
      router.navigate(`/home/join-call/${call.id}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View>
        <Image source={AppPNGs.IcVideoCall} style={styles.callIcon} />
      </View>
      <View style={styles.details}>
        <View style={styles.participantNames}>
          {members.map((participant, index) => (
            <Text key={participant.user_id} style={styles.name}>
              {participant.user.name || participant.user_id}
              {index < members.length - 1 ? ", " : ""}
            </Text>
          ))}
        </View>
        <View style={styles.stateAndTimeView}>
          <Text style={styles.time}>
            {callingState} {createdAt?.toLocaleTimeString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
    backgroundColor: AppColors.white,
  },
  callIcon: {
    width: 30,
    height: 30,
  },
  details: {
    flex: 1,
  },
  participantNames: {
    flexDirection: "row",
    maxWidth: "90%",
  },
  name: {
    fontSize: 18,
  },
  stateAndTimeView: {
    flexDirection: "row",
    maxWidth: "90%",
  },
  time: {
    fontSize: 14,
    textTransform: "capitalize",
  },
});
