import { useCall, useCallStateHooks, useConnectedUser } from "@stream-io/video-react-native-sdk";
import { Text } from '~/components/nativewindui/Text';

export const CallInfo = () => {
  const call = useCall();


  const { useCallCallingState, useParticipants, useCallMembers } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const members = useCallMembers();

  return (
    <>
      <Text>Call: {call?.cid}</Text>
      <Text>State: {callingState}</Text>
      <Text>Participants: {participants.length}</Text>
      <Text>Members: {members.length}</Text>
      {members.map((member) => (
        <Text key={member.user_id}>{member.user.name}</Text>
      ))}
    </>
  );
};
