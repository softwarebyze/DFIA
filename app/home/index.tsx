import { colorPalette, StreamVideoRN } from "@stream-io/video-react-native-sdk";
import { analytics } from "analytics";
import { CallButton } from "components/CallButton";
import { Calls } from "components/Calls";
import { Screen } from "components/Screen";
import { useRouter, Link } from "expo-router";
import { FirebaseError } from "firebase/app";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  User,
} from "firebase/auth";
import { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  AlertButton,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { auth } from "../../firebase";
import AppColors from "constants/app.colors";
import { AuthContext } from "context/AuthContext";
import { PastCalls } from "components/PastCall";
import { IncomingCalls } from "components/IncomingCall";
import { IncomingCallComponent } from "components/IncomingCallComponent";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppPNGs } from "constants/app.image";

export default function Home() {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading]);

  const logOut = async () => {
    await StreamVideoRN.onPushLogout();
    signOut(auth);
  };

  if (isLoading) {
    // Optionally display a loading indicator
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const getNewCallId = () => `${Date.now()}-${user?.displayName}`;

  const onSetting = () => {
    router.push(`/home/settings`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.userName}>Hi, {user?.displayName}</Text>
          <Link href="/home/settings" style={styles.iconLink}>
            <Ionicons
              name={AppPNGs.IcSetting}
              style={styles.icon}
              size={30}
              color="black"
            />
          </Link>
        </View>
        <View style={styles.underlineView}></View>
        <IncomingCallComponent />
        <PastCalls />
        <CallButton onPress={() => router.push(`/home/create-call`)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconLink: {
    padding: 8,
  },
  underlineView: {
    height: 1,
    backgroundColor: AppColors.border,
    width: "100%",
    marginTop: 12,
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  icon: {
    width: 30,
    height: 30,
  },
});
