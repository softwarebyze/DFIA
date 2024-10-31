import {
  Call,
  StreamCall as StreamCallOriginal,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useEffect, useState } from "react";

export const StreamCall = ({
  callId,
  children,
}: {
  callId: Call["id"];
  children: React.ReactNode;
}) => {
  const [call, setCall] = useState<Call>();
  const client = useStreamVideoClient()!;

  useEffect(() => {
    const call = client.call("default", callId);
    setCall(call);
  }, [callId, client]);

  if (!call) return null;

  return <StreamCallOriginal call={call}>{children}</StreamCallOriginal>;
};
