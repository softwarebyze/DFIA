// app/home/[callId].tsx
import {
  CallContent,
  CallingState,
  useCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { CallInfo } from "components/CallInfo";
import { StreamCall } from "components/StreamCall";
import { AuthContext } from "context/AuthContext";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

const angelUserIds = ["vmljsmXYDBMloSozpWUxZSQdSHj2"];

const Call = () => {
  const client = useStreamVideoClient();
  const call = useCall();

  const router = useRouter();

  useEffect(() => {
    const createCall = async () => {
      if (!client) {
        console.error("Log :: No client");
        return;
      }

      if (!client.streamClient.userID) {
        console.error("Log :: No user id at call creation");
        return;
      }

      const members = [
        { user_id: client.streamClient.userID },
        { user_id: "vmljsmXYDBMloSozpWUxZSQdSHj2" },
      ];

      await call?.getOrCreate({
        ring: true,
        data: {
          members,
        },
      });
      await call?.join();
    };

    createCall();
  }, []);
  const endCall = async () => {
    try {
      await call?.endCall();
    } catch (error) {}
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return <CallContent onHangupCallHandler={endCall} />;
};

const CreateCall = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [newCallId, setNewCallId] = useState<string>();

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }
    const callId = `${Date.now()}-${user?.displayName}`;
    setNewCallId(callId);
  }, []);

  return newCallId ? (
    <StreamCall callId={newCallId}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <CallInfo /> */}
        <Call />
      </SafeAreaView>
    </StreamCall>
  ) : (
    <View>
      <Text>Loading</Text>
    </View>
  );
};

export default CreateCall;
