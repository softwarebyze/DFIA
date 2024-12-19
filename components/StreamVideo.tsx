// https://getstream.io/video/docs/reactnative/core/client-auth/#streamvideo-context-provider

// @ts-ignore
const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;

import {
  StreamVideoClient,
  StreamVideo as StreamVideoOfficial,
} from "@stream-io/video-react-native-sdk";
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
    const myClient = StreamVideoClient.getOrCreateInstance({
      apiKey,
      user: { id: user.uid, name: user?.displayName ?? undefined },
      tokenProvider: getStreamUserToken,
    });

    console.log("myClient");
    setClient(myClient);

    return () => {
      myClient.disconnectUser();
      setClient(undefined);
    };
  }, [user.uid]);

  if (!client) {
    return null;
  }

  return <StreamVideoOfficial client={client}>{children}</StreamVideoOfficial>;
};
