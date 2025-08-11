// app/signup.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { JSX, useState } from "react";

import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { authHelpers, supabase } from "./supabase"; // <-- make sure path is correct

export default function SignUp(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handlesignup = async () => {
    if (!username.trim() || !email.trim() || !password) {
      Alert.alert("Validation", "Please enter username, email and password.");
      return;
    }

    setLoading(true);
    try {
      // create auth user via your helper
      // cast username to any to avoid earlier TS mismatch if your supabase helper has loose JS types
      const { data, error } = await authHelpers.signUp(
        email.trim(),
        password,
        username.trim() as any
      );

      if (error) {
        console.error("Sign up error:", error);
        Alert.alert("Signup failed", error.message ?? JSON.stringify(error));
        return;
      }

      // Try to read the current user/session (signUp may or may not return a session depending on email confirm settings)
      const { data: userData, error: getUserErr } =
        await supabase.auth.getUser();
      if (getUserErr) {
        console.warn("getUser after signUp returned error:", getUserErr);
      }

      const user = userData?.user ?? null;

      if (!user) {
        // common when email confirmation flow is enabled
        Alert.alert(
          "Signup initiated",
          "Account created. Please confirm email (if required) before logging in."
        );
      } else {
        // create profile row in `public.profiles` (make sure table exists and RLS/policies allow this)
        const { data: profileData, error: insertErr } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              email: user.email,
              username: username.trim(),
            },
          ])
          .select();

        if (insertErr) {
          console.error("Failed to insert profile:", insertErr);
          // inform user but don't hide signup success
          Alert.alert(
            "Partial success",
            "Account created but failed to create profile. Check console for details."
          );
        } else {
          console.log("Profile created:", profileData);
        }
      }

      Alert.alert(
        "Success",
        "Account created! Please check your email if confirmation is required."
      );

      // navigate — cast to Href to satisfy expo-router types
      router.push("/HomeScreen" as unknown as Href);
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.signInText}>
            Sign UP to record your assessment
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#888"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#888"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#888"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signInButton, loading && { opacity: 0.8 }]}
            onPress={handlesignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.signInButtonText}>Sign UP</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  content: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    margin: 20,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  signInText: { color: "#666", marginBottom: 20 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, color: "#333", marginBottom: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16 },
  signInButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: { color: "white", fontWeight: "bold", fontSize: 18 },
});
