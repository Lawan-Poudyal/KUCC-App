import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { supabase } from "../lib/supabase";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [loading, setLoading] = useState(false);
  const { access_token, refresh_token, type } = useLocalSearchParams();
useEffect(() => {
  if (type === "recovery" && access_token && refresh_token) {
    supabase.auth.setSession({
      access_token,
      refresh_token,
    });
  }
}, [access_token, refresh_token, type]);
useEffect(() => {
  if (type && type !== "recovery") {
    Alert.alert("Invalid link");
    router.replace("/(auth)/login");
  }
}, [type]);



  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const isDisabled =
    loading || password.length < 8 || password !== confirmPassword;

  const handleResetPassword = async () => {
    if (password.length < 8) {
      Alert.alert("Password too short", "Minimum 8 characters required");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      Alert.alert("Success", "Password updated successfully");

      await supabase.auth.signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#5B5F8D" />
        </TouchableOpacity>

        {/* Title */}
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          Reset your password
        </Animatable.Text>

        <Text style={styles.subText}>
          Set the new password for your account so that you can login and
          access all the features
        </Text>

        {/* New Password */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Enter new password</Text>

          <View
            style={[
              styles.inputBox,
              password.length > 0 && password.length < 8 && styles.inputError,
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#888" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure1}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setSecure1(!secure1)}>
              <Ionicons
                name={secure1 ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>
            Password must be at least 8 characters
          </Text>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Confirm password</Text>

          <View
            style={[
              styles.inputBox,
              passwordsMismatch && styles.inputError,
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#888" />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secure2}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setSecure2(!secure2)}>
              <Ionicons
                name={secure2 ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.helperText,
              passwordsMismatch && { color: "#E64B4B" },
            ]}
          >
            Both passwords must match
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          disabled={isDisabled}
          style={[
            styles.resetBtn,
            isDisabled && styles.resetBtnDisabled,
          ]}
          onPress={handleResetPassword}
        >
          <Text style={styles.resetText}>
            {loading ? "Updating..." : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  inner: {
    marginTop: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#5B5F8D",
    marginTop: 10,
  },
  subText: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
    lineHeight: 18,
  },
  inputWrapper: {
    marginTop: 22,
  },
  label: {
    fontSize: 13,
    color: "#444",
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
  },
  inputError: {
    borderColor: "#E64B4B",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  resetBtn: {
    marginTop: 42,
    backgroundColor: "#5B5F8D",
    paddingVertical: 14,
    borderRadius: 32,
    alignItems: "center",
    width: "88%",
    alignSelf: "center",
  },
  resetBtnDisabled: {
    backgroundColor: "#BFC2D8",
  },
  resetText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
