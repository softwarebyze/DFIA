import { Call, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";

export const Calls = () => {
  const client = useStreamVideoClient();
  if (!client) return;
  const [renders, setRenders] = useState(0);

  const { calls } = client?.state;

  const calls2 = useOngoingCallsQuery();

  return (
    <View>
      <Text style={{ fontSize: 8, color: "transparent" }}>{renders}</Text>
      <Text> {calls.length ? "All Calls" : "No calls"}</Text>
      {calls.map((call) => (
        <CallCard key={call.id} call={call} />
      ))}
      <Text>{calls2?.length} Ongoing Call(s)</Text>
      {calls2?.map((call) => (
        <CallCard key={call.id} call={call} />
      ))}
      <Button title="Refresh" onPress={() => setRenders((r) => r + 1)} />
    </View>
  );
};

const useOngoingCallsQuery = () => {
  const client = useStreamVideoClient();
  if (!client) return;
  const [calls, setCalls] = useState(client.state.calls);

  useEffect(() => {
    const fetchOnGoingCalls = async () => {
      const { calls } = await client.queryCalls({
        filter_conditions: {
          ongoing: true,

          $or: [
            { created_by_user_id: client.streamClient.userID },
            { members: { $in: [client.streamClient.userID] } },
          ],
        },
        watch: true,
      });
      console.log("[fetchOngoingCalls] ", calls);
      setCalls(calls);
    };
    fetchOnGoingCalls();
  }, []);

  return calls;
};

export const CallCard = ({ call }: { call: Call }) => {
  return (
    <Link asChild href={`/home/${call.id}`}>
      <Pressable
        style={{
          padding: 8,
          borderWidth: 2,
          borderColor: "gray",
          borderRadius: 8,
        }}
      >
        <Text>{call.id}</Text>
      </Pressable>
    </Link>
  );
};
