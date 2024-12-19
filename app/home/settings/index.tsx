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
  TouchableOpacity,
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
import { useRouter } from "expo-router";
import { StreamVideoRN } from "@stream-io/video-react-native-sdk";
import { AuthContext } from "context/AuthContext";
import { auth } from "firebase";
import { analytics } from "analytics";
import { FirebaseError } from "firebase/app";
import AppColors from "constants/app.colors";
import { AppPNGs } from "constants/app.image";

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
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Image source={AppPNGs.IcBack} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Settings</Text>
        </View>
        {/* <Text style={styles.title}>{"Name"}</Text>
        <Text style={styles.subtitle}>{user?.displayName || ""}</Text>
        <Text style={styles.title}>{"Email"}</Text>
        <Text style={styles.subtitle}>
          {user?.email || "No email available"}
        </Text> */}
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
        <TouchableOpacity style={styles.button} onPress={onLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={onDeleteAccount}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
    justifyContent: "flex-start",
  },
  backArrow: {
    width: 24,
    height: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.black,
    flex: 1, // Takes up remaining space
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
  // subtitle: {
  //   fontSize: 18,
  //   color: AppColors.black,
  //   marginBottom: 10,
  // },

  email: {
    fontSize: 16,
    color: AppColors.black,
    marginBottom: 10,
  },
  button: {
    marginTop: 50,
    backgroundColor: AppColors.blue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: AppColors.red,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
