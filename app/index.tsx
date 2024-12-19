// app/index.tsx
import { colorPalette } from "@stream-io/video-react-native-sdk";
import { Screen } from "components/Screen";
import { SignIn } from "components/SignIn";
import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppColors from "constants/app.colors";
import { AuthContext } from "context/AuthContext";

export default function App() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [user, isLoading]);

  if (isLoading) {
    // Optionally display a loading indicator
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const onSignIn = () => {
    router.navigate("/signin");
  };

  const onSignUp = () => {
    router.navigate("/signup");
  };

  return (
    <Screen>
      <Text style={styles.title}>{"DFIA"}</Text>
      <Text style={styles.subtitle}>{"Don't Face It Alone"}</Text>
      <TouchableOpacity style={styles.signInBtn} onPress={onSignIn}>
        <Text style={styles.signInBtnText}>{"Sign In"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signInBtn} onPress={onSignUp}>
        <Text style={styles.signInBtnText}>{"Sign Up"}</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colorPalette.colors.primary,
    fontSize: 48,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  subtitle: {
    color: colorPalette.colors.secondary,
    fontSize: 24,
    marginBottom: 28,
  },
  signInBtn: {
    backgroundColor: AppColors.blue,
    paddingVertical: 15,
    paddingHorizontal: 43,
    borderRadius: 40,
    borderWidth: 1,
    marginBottom: 20,
    minWidth: "70%",
    alignItems: "center",
  },
  signInBtnText: {
    color: AppColors.white,
    fontSize: 16,
  },
});
