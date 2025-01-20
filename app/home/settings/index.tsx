// React Native Functional Component for Settings
// Here a User Name, Email , Logout, Delete Account will be displayed
// File path: /Users/tarakagile/Documents/Projects/DFIA/app/settings/index.tsx
// Content:
import { useContext } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  AlertButton,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  User,
} from "firebase/auth";
import { useRouter, Link } from "expo-router";
import { StreamVideoRN } from "@stream-io/video-react-native-sdk";
import { AuthContext } from "context/AuthContext";
import { auth } from "firebase";
import { analytics } from "analytics";
import { FirebaseError } from "firebase/app";
import AppColors from "constants/app.colors";
import { AppPNGs } from "constants/app.image";
import Ionicons from "@expo/vector-icons/Ionicons";

const deleteAccount = async (user: User) => {
  analytics.track("deleteAccount", { user });
  try {
    await deleteUser(user);
  } catch (err) {
    if (err instanceof FirebaseError) {
      if (err.code === "auth/requires-recent-login") {
        return Alert.prompt(
          "Confirm your password to delete account",
          user.email || "",
          [
            {
              text: "Cancel",
              onPress(password: any) {
                analytics.track("deleteAccountCancelled", { password });
              },
            },
            {
              text: "Delete",
              style: "destructive",
              async onPress(password) {
                if (!password) {
                  analytics.track("deleteAccountError", {
                    err: "no password",
                  });
                  return;
                }
                if (!user.email) {
                  analytics.track("deleteAccountError", {
                    err: "no email",
                  });
                  throw new Error("no email");
                }
                const reauthenticatedUser = await reauthenticateWithCredential(
                  user,
                  EmailAuthProvider.credential(user.email, password),
                );
                deleteUser(reauthenticatedUser.user);
              },
            },
          ] satisfies ((text: string) => void) | AlertButton[],
        );
      }
    }

    analytics.track("deleteAccountError", { err });
    console.error(err);
  }
};
export default function Settings() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const onLogout = async () => {
    await StreamVideoRN.onPushLogout();
    signOut(auth);
  };

  const onDeleteAccount = () => {
    if (!user) return;
    deleteAccount(user);
  };
  const onBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Link
            href=".."
            onPress={event => {
              event.preventDefault();
              onBack();
            }}
            style={styles.backButton}>
            <Ionicons
              name={AppPNGs.IcBack}
              style={styles.backArrow}
              size={30}
              color="black"
            />
          </Link>
          <Text style={styles.headerText}>Settings</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.nameTitle}>Name</Text>
          <Text style={styles.subtitle}>
            {user?.displayName || "No name available"}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.nameTitle}>Email</Text>
          <Text style={styles.subtitle}>
            {user?.email || "No email available"}
          </Text>
        </View>
        <View style={styles.button}>
          <Link
            href=".."
            onPress={async event => {
              event.preventDefault();
              await onLogout();
            }}
            style={styles.linkButton}>
            <Text style={styles.buttonText}>Logout</Text>
          </Link>
        </View>
        <View style={[styles.button, styles.deleteButton]}>
          <Link
            href=".."
            onPress={event => {
              event.preventDefault();
              onDeleteAccount();
            }}
            style={[styles.linkButton]}>
            <Text style={styles.buttonText}>Delete Account</Text>
          </Link>
        </View>
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
    backgroundColor: AppColors.white,
    padding: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
    paddingLeft: 0,
  },
  backArrow: {
    width: 24,
    height: 24,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: AppColors.black,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    borderBottomColor: AppColors.disable,
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingTop: 5,
  },
  nameTitle: {
    fontWeight: "bold",
    fontSize: 18,
    flex: 1,
    paddingLeft: 6,
  },
  subtitle: {
    fontSize: 18,
    color: AppColors.black,
    flex: 1,
    textAlign: "right",
    paddingRight: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: AppColors.black,
  },
  email: {
    fontSize: 16,
    color: AppColors.black,
    marginBottom: 10,
  },
  button: {
    marginTop: 50,
    backgroundColor: AppColors.blue,
    borderRadius: 12,
    alignItems: "center",
    height: 50,
    width: "80%",
    justifyContent: "center",
  },
  linkButton: {
    paddingVertical: 12,
    width: "100%",
    textAlign: "center",
    // backgroundColor: AppColors.grey,
  },
  deleteButton: {
    marginTop: 21,
    backgroundColor: AppColors.red,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
