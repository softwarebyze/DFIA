import AppColors from "constants/app.colors";
import { Link, router } from "expo-router";
import { auth } from "firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
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

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to validate inputs
  const validateInputs = () => {
    if (!email || !email.includes("@")) return "Please enter a valid email.";
    if (!password || password.length < 6)
      return "Password must be at least 6 characters.";
    return null;
  };

  const onSignUp = () => {
    router.push("/signup");
  };
  const signIn = async () => {
    setErrorMessage(null); // Reset error message
    const validationError = validateInputs();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    try {
      let userCred = await signInWithEmailAndPassword(auth, email, password);
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
        <Text style={styles.title}>Sign In</Text>
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

        {/* Error Message */}
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        {/* Submit Button */}
        <View
          style={[
            styles.linkButtonContainer,
            loading ? styles.buttonDisabled : null,
          ]}>
          <Link
            href="#"
            onPress={event => {
              event.preventDefault();
              signIn();
            }}
            disabled={loading}
            style={styles.button}>
            <Text style={styles.buttonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </Link>
        </View>
        <View style={styles.dontAccount}>
          <Text style={styles.text}>Don't have an account? </Text>
          <Link
            href="#"
            onPress={event => {
              event.preventDefault();
              onSignUp();
            }}
            style={styles.linkText}>
            <Text style={styles.linkText}>Sign Up</Text>
          </Link>
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
    marginBottom: 30,
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
  linkButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: AppColors.blue,
  },
  buttonContainer: {
    marginTop: 10,
  },
  errorText: {
    color: AppColors.red,
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    width: "100%",
    textAlign: "center",
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginTop: 10,
    textAlign: "center",
  },
  buttonDisabled: {
    // paddingHorizontal: 90,
    backgroundColor: AppColors.disable, // Lighter green for disabled state
  },
  dontAccount: {
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
