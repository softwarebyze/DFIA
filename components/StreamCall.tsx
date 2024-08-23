import {
  Call,
  StreamCall as StreamCallOriginal,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useState } from "react";

// const callId = "my-call-id";
const testCallId = "audio_room_5c5b8ef3-7332-4df1-baf5-88a536027ecb";

export const StreamCall = ({
  callId = testCallId,
  children,
}: {
  callId?: Call["id"];
  children: React.ReactNode;
}) => {
  const client = useStreamVideoClient()!;

  if (!client) throw new Error("Client not found", client);

  const [call] = useState(() => {
    const call = client?.call("default", callId);
    call.join({ create: true });
    return call;
  });

  if (!call) return null;

  return <StreamCallOriginal call={call}>{children}</StreamCallOriginal>;
};
