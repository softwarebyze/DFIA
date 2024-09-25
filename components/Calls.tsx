import {
  StreamCall,
  useCall,
  useCalls,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export const Calls = () => {
  const calls = useCalls();

  return (
    <View>
      <Text> {calls.length ? "All Calls" : "No calls"}</Text>
      {calls.map((call) => (
        <StreamCall key={call.id} call={call}>
          <CallCard />
        </StreamCall>
      ))}
    </View>
  );
};

export const CallCard = () => {
  const call = useCall();
  const { useCallCallingState, useParticipants, useCallCreatedAt } =
    useCallStateHooks();

  const callingState = useCallCallingState();
  const participants = useParticipants();
  const createdAt = useCallCreatedAt();

  if (!call) return;
  return (
    <Link asChild href={`/home/${call.id}`}>
      <Pressable
        style={{
          padding: 8,
          borderWidth: 2,
          borderColor: "gray",
          borderRadius: 8,
          flexDirection: "row",
          gap: 8
        }}
      >
        <Text style={{ fontSize: 18 }}>📞</Text>
        <View>
          <Text>{callingState}</Text>
          <Text>{participants.length} Participants</Text>
          {participants.map((participant) => (
            <Text key={participant.userId}>{participant.name}</Text>
          ))}
          <Text>{createdAt?.toLocaleTimeString()}</Text>
          <Text style={{fontSize: 12}}>{call.id}</Text>
        </View>
      </Pressable>
    </Link>
  );
};
