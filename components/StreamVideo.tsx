// https://getstream.io/video/docs/reactnative/core/client-auth/#streamvideo-context-provider

// const client = new StreamVideoClient({ apiKey, user, token });
// const call = client.call("default", callId);
// call.join({ create: true });

// @ts-ignore
const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci1pZCJ9.FsOXuMPktDVKtI_cF8dqc0Csl1oIUuO_6VZ_iHGxioY";
const tokenProvider = () => Promise.resolve(token);

// const user: User = {
//   id: 'sara',
// };

const useUser = (): User => ({
  id: "sara",
});

// const

import {
  StreamVideoClient,
  StreamVideo as StreamVideoOfficial,
  User,
} from "@stream-io/video-react-native-sdk";
import { useState, useEffect } from "react";

export const StreamVideo = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<StreamVideoClient>();
  useEffect(() => {
    // const myClient = StreamVideoClient.getOrCreateInstance({ apiKey, user, tokenProvider });
    const user = useUser();
    const myClient = new StreamVideoClient({ apiKey, user, tokenProvider });
    // setClient(myClient);
    setClient(myClient);
    return () => {
      myClient.disconnectUser();
      setClient(undefined);
    };
  }, []);

  if (!client) return null;

  return <StreamVideoOfficial client={client}>{children}</StreamVideoOfficial>;
};

// const client = new StreamVideoClient({ apiKey, user, token });
// const call = client.call("default", callId);
// call.join({ create: true });
