// Past Call
import React, { useEffect, useState } from "react";
import {
  Call,
  StreamCall,
  useCalls,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CallCard } from "./CallCard";
import AppColors from "constants/app.colors";

export const PastCalls = () => {
  // const calls = useCalls();
  const [callList, setCallList] = useState<Call[]>([]);
  const client = useStreamVideoClient();

  useEffect(() => {
    getCalls();
    return () => {};
  }, []);

  const getCalls = async () => {
    if (!client) {
      return;
    }

    if (!client.streamClient.userID) {
      console.error("Log :: No user id at call creation");
      return;
    }

    // USING BELOW LOGIC WE ARE CREATING A CALL
    // const members = [
    //   { user_id: client.streamClient.userID },
    //   { user_id: "vmljsmXYDBMloSozpWUxZSQdSHj2" },
    // ];

    const calls = await client?.queryCalls({
      // sort: [...sortOptions],
      filter_conditions: {
        $or: [
          { created_by_user_id: client.streamClient.userID },
          { members: { $in: [client.streamClient.userID] } },
        ],
      },
      limit: 30,
      watch: false,
    });
    setCallList(calls?.calls ? calls.calls : []);
  };
  return (
    <View style={styles.container}>
      {!callList.length ? (
        <Text style={styles.noPastCalls}>No past calls</Text>
      ) : (
        <View>
          <Text style={styles.title}>{"Past Calls"}</Text>
          <ScrollView contentContainerStyle={styles.list}>
            {callList.map(call => (
              <StreamCall key={call.id} call={call}>
                <CallCard />
              </StreamCall>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    marginTop: 10,
  },
  list: {
    paddingBottom: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noPastCalls: {
    marginTop: 300,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: AppColors.black,
    textAlign: "center",
  },
});
