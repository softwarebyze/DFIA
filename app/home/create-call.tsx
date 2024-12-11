// app/home/[callId].tsx
import {
  CallContent,
  useCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { CallInfo } from "components/CallInfo";
import { StreamCall } from "components/StreamCall";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { AuthContext } from "../_layout";

const angelUserIds = ["vmljsmXYDBMloSozpWUxZSQdSHj2"];

const Call = () => {
  const client = useStreamVideoClient();
  const call = useCall();

  const router = useRouter();

  useEffect(() => {
    const createCall = async () => {
      if (!client) {
        console.error("No client");
        return;
      }

      if (!client.streamClient.userID) {
        console.error("No user id at call creation");
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

  return (
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
  );
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
        <CallInfo />
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
