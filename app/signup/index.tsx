import AppColors from "constants/app.colors";
import { router } from "expo-router";
import { auth } from "firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { analytics } from "analytics";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to validate inputs
  const validateInputs = () => {
    if (!email || !email.includes("@")) return "Please enter a valid email.";
    if (!username) return "Please enter a username.";
    if (!password || password.length < 6)
      return "Password must be at least 6 characters.";
    if (password !== confirmPassword)
      return "Passwords do not match. Please try again.";

    return null;
  };
  const onSignIn = () => {
    router.push("/signin");
  };

  const signUp = async () => {
    setErrorMessage(null); // Reset error message
    const validationError = validateInputs();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    try {
      analytics.track("createUser", { email, username });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      analytics.track("updateProfile", { username });
      await updateProfile(userCredential.user, { displayName: username });
      console.log("User signed in successfully!", userCredential);
      router.replace("/home");
      // Handle successful login (e.g., navigation or alert)
    } catch (error: any) {
      const firebaseErrorMessage =
        error.message || "Something went wrong. Please try again.";
      setErrorMessage(firebaseErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <Text style={styles.appName}>{"DFIA"}</Text>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {/* Error Message */}
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.button,
            loading ? styles.buttonDisabled : null, // Disabled state styling
          ]}
          onPress={signUp}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <View style={styles.haveAccount}>
          <Text style={styles.text}>have an account? </Text>
          <TouchableOpacity onPress={onSignIn}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.blue,
    paddingHorizontal: 20,
  },
  appName: {
    color: AppColors.white,
    fontSize: 50,
    fontWeight: "bold",
    fontStyle: "italic",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: AppColors.formBG,
    borderRadius: 12,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
    shadowColor: AppColors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: AppColors.white,
  },
  buttonContainer: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: AppColors.blue,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: AppColors.disable, // Lighter green for disabled state
  },
  haveAccount: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.blue,
  },
});
