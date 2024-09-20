// https://getstream.io/video/docs/reactnative/core/client-auth/#streamvideo-context-provider

// @ts-ignore
const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;

import {
  StreamVideoClient,
  StreamVideo as StreamVideoOfficial,
} from "@stream-io/video-react-native-sdk";
import { analytics } from "analytics";
import { getStreamUserToken } from "firebase";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export const StreamVideo = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  const [client, setClient] = useState<StreamVideoClient>();

  useEffect(() => {
    const myClient = new StreamVideoClient({
      apiKey,
      user: { id: user.uid },
      tokenProvider: getStreamUserToken,
    });

    // myClient.state.getCurrentValue()

    
    // myClient.on("call.created", console.log);
    const custom= myClient?.state.connectedUser?.custom
    const custom1= myClient.streamClient.user?.custom
    
    analytics.track("StreamVideoClientCreated", {
      custom,
      custom1
    });

    setClient(myClient);

    return () => {
      console.log("Disconnecting user from StreamVideo");
      myClient.disconnectUser();
      setClient(undefined);
    };
  }, [user.uid]);

  if (!client) {
    analytics.track("StreamVideoClientNotReady", {});
    return null;
  }

  return <StreamVideoOfficial client={client}>{children}</StreamVideoOfficial>;
};
