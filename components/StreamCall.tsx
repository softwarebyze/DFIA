import {
  Call,
  StreamCall as StreamCallOriginal,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useState } from "react";

export const StreamCall = ({
  callId,
  children,
}: {
  callId: Call["id"];
  children: React.ReactNode;
}) => {
  const client = useStreamVideoClient()!;

  if (!client) throw new Error("Client not found", client);

  const [call] = useState(() => {
    const call = client?.call("default", callId);
    (async () =>
      await call.getOrCreate({
        ring: true,
        data: {
          members: [
            { user_id: client.streamClient.userID! },
            { user_id: "vmljsmXYDBMloSozpWUxZSQdSHj2" },
          ],
        },
      }))();
    call.join({ create: true });
    return call;
  });

  if (!call) return null;

  return <StreamCallOriginal call={call}>{children}</StreamCallOriginal>;
};
