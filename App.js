import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: "#EFFFB0",
          paddingVertical: 15,
          paddingHorizontal: 43,
          borderRadius: 40,
        }}
        onPress={() => alert("Calling angel...")}
      >
        <Text style={{ fontSize: 22 }}>Call an Angel</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
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
