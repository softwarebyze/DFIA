import {
  CallingState,
  StreamCall,
  useCall,
  useCalls,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export const Calls = () => {
  const calls = useCalls();
  // handle incoming ring calls
  const [firstIncomingCall] = calls.filter(
    (call) =>
      call.isCreatedByMe === false &&
      call.state.callingState === CallingState.RINGING
  );

  const joinedCalls = calls.filter(
    (call) => call.state.callingState === CallingState.JOINED
  );

  const navigateToCall = (callId: string) => {
    router.replace(`/home/${callId}`);
  };

  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.join && firstIncomingCall?.id) {
      navigateToCall(firstIncomingCall.id);
    }
  }, [params.join, firstIncomingCall?.id]);

  useEffect(() => {
    const joinedCall = joinedCalls[0];
    if (joinedCall && params.join) {
      console.log("[Calls] joinedCalls: ", joinedCalls.length);
      navigateToCall(joinedCall.id);
    }
  }, [joinedCalls, params.join]);

  return (
    <View>
      {firstIncomingCall && (
        <>
          <Text style={{ fontSize: 24 }}>Incoming Call</Text>
          <StreamCall call={firstIncomingCall}>
            <CallCard />
          </StreamCall>
        </>
      )}
      <Text style={{ fontSize: 18 }}>
        {calls.length ? "All Calls" : "No calls"}
      </Text>
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
  const {
    useCallCallingState,
    useParticipants,
    useCallCreatedAt,
    useParticipantCount,
    useCallMembers,
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const participants = useParticipants();
  const createdAt = useCallCreatedAt();
  const participantCount = useParticipantCount();
  const members = useCallMembers();

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
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 18 }}>📞</Text>
        <View>
          <Text>{callingState}</Text>
          <Text>{participantCount} Participants</Text>
          <Text>{members.length} Members</Text>
          {participants.map((participant) => (
            <Text key={participant.userId}>
              {participant.name || participant.userId}
            </Text>
          ))}
          <Text>{createdAt?.toLocaleTimeString()}</Text>
          <Text style={{ fontSize: 12 }}>{call.id}</Text>
        </View>
      </Pressable>
    </Link>
  );
};
