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
  const client = useStreamVideoClient()!;
  const [call, setCall] = useState<Call | null>(null);

  if (!client) throw new Error("Client not found", client);

  // https://arc.net/l/quote/odueljxn
  // const [call] = useState(() => {
  useEffect(() => {
    const setupCall = async () => {
      const c = client?.call("default", callId);
      const newCallResponse = await c.getOrCreate({
        ring: true,
        data: {
          members: [
            { user_id: client.streamClient.userID! }, // me
            { user_id: "vmljsmXYDBMloSozpWUxZSQdSHj2" }, // angel
            // { user_id: "angel1" },
            // { user_id: "angel1" },
          ],
        },
      });
      const newCall = newCallResponse.call;
      if (!newCall) throw new Error("Call not found");
      setCall(c);
    };
    setupCall();
  },[callId, client]);

  if (!call) return null;

  return <StreamCallOriginal call={call}>{children}</StreamCallOriginal>;
};
