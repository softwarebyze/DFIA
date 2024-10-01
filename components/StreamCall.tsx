import {
  Call,
  StreamCall as StreamCallOriginal,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useEffect, useState } from "react";

const angelUserIds = ["vmljsmXYDBMloSozpWUxZSQdSHj2"];

export const StreamCall = ({
  callId,
  children,
}: {
  callId: Call["id"];
  children: React.ReactNode;
}) => {
  const client = useStreamVideoClient()!;

  if (!client) throw new Error("Client not found", client);

  const [call, setCall] = useState<Call>();

  useEffect(() => {
    const getOrCreateCall = async () => {
      const call = client?.call("default", callId);
      const isAngel = angelUserIds.includes(client.streamClient.userID!);
      console.log("isAngel: ", isAngel);
      const members = isAngel
        ? []
        : [
            { user_id: client.streamClient.userID! },
            { user_id: "vmljsmXYDBMloSozpWUxZSQdSHj2" },
          ];
      await call.getOrCreate({
        ring: true,
        data: {
          members,
        },
      });
      call.join();
      setCall(call);
    };
    getOrCreateCall();
  }, []);

  if (!call) return null;

  return <StreamCallOriginal call={call}>{children}</StreamCallOriginal>;
};
