import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";

export default function ForgotPasswordScreen() {
  const { signIn, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [loading, setLoading] = useState(false);

  // Request a password reset code
const onRequestReset = async () => {
  if (!email.trim()) {
    Alert.alert("Missing Email", "Please enter your email address.");
    return;
  }

  if (!isLoaded || !signIn) {
    Alert.alert("Error", "Authentication service is not ready. Please try again.");
    return;
  }

  try {
    setLoading(true);
    await signIn.create({
      strategy: "reset_password_email_code",
      identifier: email,
    });

    setSuccessfulCreation(true);
    Alert.alert(
      "Code Sent",
      "A password reset code has been sent to your email."
    );
  } catch (err) {
    console.error("Reset request error:", JSON.stringify(err, null, 2));
    
    let errorMessage = "Failed to send reset code";
    if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      errorMessage = err.errors[0].message;
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    Alert.alert("Error", errorMessage);
  } finally {
    setLoading(false);
  }
};

// Reset the password with the code and new password
const onReset = async () => {
  if (!code.trim() || !password.trim()) {
    Alert.alert("Missing Information", "Please enter code and new password.");
    return;
  }

  if (password.length < 8) {
    Alert.alert("Weak Password", "Password must be at least 8 characters.");
    return;
  }

  if (!isLoaded || !signIn) {
    Alert.alert("Error", "Authentication service is not ready. Please try again.");
    return;
  }

  try {
    setLoading(true);
    const result = await signIn.attemptFirstFactor({
      strategy: "reset_password_email_code",
      code,
      password,
    });

    if (result.status === "complete") {
      Alert.alert("Success", "Password has been reset successfully!");
      router.replace("/(auth)/login");
    } else {
      Alert.alert("Error", "Unable to reset password. Please try again.");
    }
  } catch (err) {
    console.error("Reset error:", JSON.stringify(err, null, 2));
    
    let errorMessage = "Invalid code or password";
    if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      errorMessage = err.errors[0].message;
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    Alert.alert("Reset Failed", errorMessage);
  } finally {
    setLoading(false);
  }
};
 
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#383F78" />
            </TouchableOpacity>
            <Text style={styles.title}>Reset Password</Text>
          </View>

          {!successfulCreation ? (
            <>
              <Text style={styles.description}>
                Enter your email address and we`ll send you a code to reset your
                password.
              </Text>

              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={18} color="#383F78" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={onRequestReset}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "SENDING..." : "SEND RESET CODE"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.description}>
                Enter the code sent to your email and your new password.
              </Text>

              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={18} color="#383F78" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Verification Code"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={18} color="#383F78" />
                <TextInput
                  style={styles.textInput}
                  placeholder="New Password (min 8 characters)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={onReset}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "RESETTING..." : "RESET PASSWORD"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 20, alignSelf: "center" }}
                onPress={() => setSuccessfulCreation(false)}
              >
                <Text style={{ color: "#5B5F8D" }}>Didn`t receive code? Try again</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  backButton: {
    marginRight: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#383F78",
  },

  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    lineHeight: 20,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 18,
    height: 48,
    marginTop: 12,
    borderWidth: 1.2,
    borderColor: "#DADAEA",
  },

  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  button: {
    backgroundColor: "#5B5F8D",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 26,
    width: 180,
    alignSelf: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },
});