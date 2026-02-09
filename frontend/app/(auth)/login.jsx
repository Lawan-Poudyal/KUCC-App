import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useSignIn, useAuth } from "@clerk/clerk-expo";

const { width, height } = Dimensions.get("window");
const logoSize = 100;

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { getToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    Alert.alert(
      "Missing Information",
      "Please enter both email and password."
    );
    return;
  }

  // ✅ Check if Clerk is loaded AND signIn exists
  if (!isLoaded || !signIn) {
    Alert.alert("Error", "Authentication service is not ready. Please try again.");
    return;
  }

  try {
    setLoading(true);

    // Start the sign-in process using the email and password provided
    const signInAttempt = await signIn.create({
      identifier: email,
      password,
    });

    // If sign-in process is complete, set the created session as active
    // and redirect the user
    if (signInAttempt.status === "complete") {
      await setActive({ session: signInAttempt.createdSessionId });

      // ✅ WAIT for sync to complete BEFORE navigating
      try {
        let token = null;
        let retries = 0;
        const maxRetries = 5;
        
        // Retry getting token if not immediately available
        while (!token && retries < maxRetries) {
          token = await getToken();
          if (!token) {
            await new Promise(resolve => setTimeout(resolve, 300));
            retries++;
          }
        }
        
        if (token) {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/api/user/sync`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("✅ User synced to Supabase:", data);
          } else {
            const errorData = await response.json();
            console.error("❌ Sync failed:", errorData);
          }
        } else {
          console.log("⚠️ No token available after retries");
        }
      } catch (syncError) {
        console.error("❌ Sync error:", syncError);
      }

      router.replace("/(tabs)");
    } else {
      // If the status is not complete, check why. User may need to
      // complete further steps.
      console.error("Login incomplete:", JSON.stringify(signInAttempt, null, 2));
      Alert.alert("Login Failed", "Please complete additional steps.");
    }
  } catch (err) {
    console.error("Login Error:", JSON.stringify(err, null, 2));

    // ✅ Better error handling
    let errorMessage = "Invalid email or password";

    if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      errorMessage = err.errors[0].message;
    } else if (err?.message) {
      errorMessage = err.message;
    }

    Alert.alert("Login Failed", errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleForgotPassword = () =>
    router.push({ pathname: "/(auth)/forgot-password" });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ================= TOP ================= */}
        <View>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeText}>Hello</Text>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
          </View>

          <Animatable.View
            animation="fadeInDown"
            duration={900}
            style={styles.logoWrapper}
          >
            <Image
              source={{
                uri: "https://www.bing.com/th/id/OIP.-MHxVaRWUStiVS8nNk_tuAHaGB",
              }}
              style={{ width: logoSize, height: logoSize }}
              resizeMode="contain"
            />
          </Animatable.View>
        </View>

        {/* ================= MIDDLE ================= */}
        <View style={styles.middle}>
          <View style={styles.form}>
            {/* EMAIL */}
            <Text style={styles.label}>Email</Text>
            <View
              style={[
                styles.inputBox,
                focusedInput === "email" && styles.inputFocused,
              ]}
            >
              <Ionicons name="mail-outline" size={18} color="#383F78" />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* PASSWORD */}
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputBox,
                focusedInput === "password" && styles.inputFocused,
              ]}
            >
              <Ionicons name="lock-closed-outline" size={18} color="#383F78" />

              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* REMEMBER + FORGET */}
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.rememberRow}
                activeOpacity={0.7}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={10} color="#fff" />
                  )}
                </View>
                <Text style={styles.rememberText}>Remember password</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotTextRed}>Forget password?</Text>
              </TouchableOpacity>
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "LOGGING IN..." : "LOGIN"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= FOOTER ================= */}
        <View style={styles.footerBox}>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.footerTitle}>Don`t have an account?</Text>
          </TouchableOpacity>

          <Text style={styles.footerSubtitle}>Sign up to get started</Text>
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

  welcomeCard: {
    backgroundColor: "#5B5F8D",
    paddingVertical: 45,
    paddingHorizontal: 26,
    borderRadius: 24,
  },

  welcomeText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
  },

  logoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  middle: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    transform: [{ translateY: -30 }],
  },

  form: {
    paddingHorizontal: 10,
  },

  label: {
    marginTop: 20,
    fontWeight: "600",
    color: "#383F78",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 18,
    height: 48,
    marginTop: 8,
    borderWidth: 1.2,
    borderColor: "#DADAEA",
  },

  inputFocused: {
    borderColor: "#5B5F8D",
  },

  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 6,
  },

  checkboxChecked: {
    backgroundColor: "#5B5F8D",
    borderColor: "#5B5F8D",
  },

  rememberText: {
    fontSize: 12,
    color: "#999",
  },

  forgotTextRed: {
    fontSize: 12,
    color: "#E64B4B",
  },

  button: {
    backgroundColor: "#5B5F8D",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
    alignSelf: "center",
    width: 160,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    elevation: 5,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },

  footerBox: {
    backgroundColor: "#5B5F8D",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
  },

  footerTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    marginBottom: 4,
    textDecorationLine: "underline",
    textDecorationColor: "#FFFFFF",
    textDecorationStyle: "solid",
  },

  footerSubtitle: {
    color: "#E0E0E0",
    fontSize: 12,
    marginBottom: 14,
  },
});