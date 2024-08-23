import { useCall, useCallStateHooks } from "@stream-io/video-react-native-sdk";
import { Text } from "react-native";

export const CallInfo = () => {
  const call = useCall();

  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();

  return (
    <>
      <Text>Call: {call?.cid}</Text>
      <Text>State: {callingState}</Text>
      <Text>Participants: {participants.length}</Text>
    </>
  );
};
