import {
    CallContent,
    CallingState,
    JoinCallButton,
    Lobby,
    RingingCallContent,
    useCall,
    useCallStateHooks,
    useStreamVideoClient,
  } from "@stream-io/video-react-native-sdk";
  import { StreamCall } from "components/StreamCall";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import { useEffect} from "react";
  import { Text} from "react-native";

const CallPreview = () => {
  const call = useCall();
  // const callState = call?.state.callingState;
  const { useCallCallingState, useParticipants, useCallMembers } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();
  const client = useStreamVideoClient()!;

  useEffect(() => {
    console.log("[CallPreview] callingState: ", callingState);
  }, [callingState]);

  const joinCall = async () => {
    call?.join();
  };

  return (
    <>
      <Text>Call Status: {call?.state.callingState}</Text>
      {callingState === CallingState.IDLE && (
        <Lobby
          JoinCallButton={() => (
            <JoinCallButton
              onPressHandler={joinCall}
            />
          )}
        />
      )}

      {callingState === CallingState.RINGING && <RingingCallContent />}
      {callingState === CallingState.JOINED && (
        <CallContent
          onHangupCallHandler={() => {
            console.log("hangup call");
            // call?.leave();
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/");
            }
          }}
        />
      )}
      {callingState === CallingState.LEFT && <Text>Left call</Text>}
    </>
  );
};

const JoinCall = () => {

    const { id } = useLocalSearchParams();

    return (
        <StreamCall callId={id as string}>
            <CallPreview />
        </StreamCall>
        
    );
};

export default JoinCall;
