import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { CallInfo } from "components/CallInfo";
import { StreamCall } from "components/StreamCall";
import { StreamVideo } from "components/StreamVideo";
import { useState } from "react";
import { CallContent } from "@stream-io/video-react-native-sdk";
import { CallButton } from "components/CallButton";
import { RevenueCat } from "components/RevenueCat";

export default function App() {
  const [screen, setScreen] = useState<"welcome" | "call">("welcome");
  return (
    <RevenueCat>
      <StreamVideo>
        {screen === "welcome" ? (
          <View style={styles.container}>
            <CallButton onPress={() => setScreen("call")} />
          </View>
        ) : (
          <StreamCall>
            <SafeAreaView style={{ flex: 1 }}>
              <CallInfo />
              <CallContent onHangupCallHandler={() => setScreen("welcome")} />
            </SafeAreaView>
          </StreamCall>
        )}
        <StatusBar style="auto" />
      </StreamVideo>
    </RevenueCat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
});
