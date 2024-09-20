import { analytics } from "analytics";
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
  StyleProp,
  Switch,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export const SignIn = () => {
  const [email, setEmail] = useState("angel@test.com");
  const [password, setPassword] = useState("123456");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const createUser = async () => {
    analytics.track("createUser", { email, username });
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    analytics.track("updateProfile", { username });
    await updateProfile(userCredential.user, { displayName: username });
  };

  const signIn = async () => signInWithEmailAndPassword(auth, email, password);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={$container}
    >
      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text style={$label}>Sign In</Text>
        <Switch
          value={mode === "signup"}
          onChange={() =>
            setMode((prev) => (prev === "login" ? "signup" : "login"))
          }
        />
        <Text style={$label}>Sign Up</Text>
      </View>
      <View style={$inputs}>
        <Text style={$label}>Email</Text>
        <TextInput
          style={$input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={$label}>Password</Text>
        <TextInput
          style={$input}
          placeholder="Password"
          value={password}
          keyboardType="visible-password"
          secureTextEntry
          onChangeText={setPassword}
        />
        {mode === "signup" && (
          <>
            <Text style={$label}>Username</Text>
            <TextInput
              style={$input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
          </>
        )}
      </View>
      {mode === "signup" && <Button title="Sign up" onPress={createUser} />}
      {mode === "login" && <Button title="Sign in" onPress={signIn} />}
    </KeyboardAvoidingView>
  );
};

const $input: StyleProp<TextStyle> = {
  padding: 8,
  borderWidth: 1,
  fontSize: 18,
  borderRadius: 8,
};
const $label: StyleProp<TextStyle> = {
  fontSize: 18,
};
const $container: StyleProp<ViewStyle> = {
  width: "80%",
  maxWidth: 400,
};
const $inputs: StyleProp<ViewStyle> = {
  gap: 6,
  marginBottom: 20,
};
