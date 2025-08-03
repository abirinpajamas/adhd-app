import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // This is a placeholder for the login logic
  const handleSignIn = () => {
    console.log("Signing in with:", email, password);
    // Here you would add your actual authentication logic
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Ionicons
          name="medkit-outline"
          size={50}
          color="white"
          style={styles.appIcon}
        />
        <Text style={styles.appName}>findADHD </Text>
        <Text style={styles.appSubtitle}>Your ADHD screening companion</Text>
        <View style={styles.securityBadges}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark-outline" size={16} color="white" />
            <Text style={styles.badgeText}>Secure</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="lock-closed-outline" size={16} color="white" />
            <Text style={styles.badgeText}>HIPAA</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.signInText}>Sign in to record your assessment</Text>

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
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.eyeIcon}>
              <Ionicons name="eye-outline" size={20} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rememberForgotPassword}>
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <Ionicons
              name={rememberMe ? "checkbox" : "square-outline"}
              size={20}
              color="#333"
              style={styles.checkbox}
            />
            <Text style={styles.rememberMeText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialLogin}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={24} color="#4285F4" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.dontHaveAccountText}>Don’t have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  header: {
    backgroundColor: "#1976d2",
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  navButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  appIcon: {
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    marginBottom: 15,
  },
  securityBadges: {
    flexDirection: "row",
    marginTop: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1565c0",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    marginLeft: 5,
  },
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
  signInText: {
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  rememberForgotPassword: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 5,
  },
  rememberMeText: {
    color: "#333",
  },
  forgotPasswordText: {
    color: "#1976d2",
    fontWeight: "bold",
  },
  signInButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
    color: "#666",
  },
  socialLogin: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 10,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dontHaveAccountText: {
    color: "#666",
    marginRight: 5,
  },
  signUpLink: {
    color: "#1976d2",
    fontWeight: "bold",
  },
});
