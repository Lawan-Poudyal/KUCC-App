import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { supabase } from "../../lib/supabase";

export default function EmailSentScreen() {
  const { email } = useLocalSearchParams();

  const resendEmail = async () => {
    if (!email) return;

const redirectUrl = AuthSession.makeRedirectUri({
  scheme: "kuccapp", 
});

const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: redirectUrl,
});

if (!error) {
  alert("Reset link sent again!");
} else {
  alert(error.message);
}


  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.iconBox}>
        <Ionicons name="mail-outline" size={70} color="#5B5F8D" />
      </Animatable.View>

      <Animatable.Text animation="fadeInUp" style={styles.title}>
        Check your email
      </Animatable.Text>

      <Text style={styles.text}>
        We’ve sent a password reset link to{" "}
        <Text style={styles.email}>{email || "your email address"}</Text>.
        Please open your email and click the link to reset your password.
      </Text>

      <Text style={styles.note}>
        Didn’t receive the email? Check your spam or junk folder.
      </Text>

      {/* Open Mail */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => Linking.openURL("mailto:")}
      >
        <Text style={styles.primaryText}>Open Email App</Text>
      </TouchableOpacity>

      {/* Resend */}
      <TouchableOpacity style={styles.secondaryBtn} onPress={resendEmail}>
        <Text style={styles.secondaryText}>Resend Email</Text>
      </TouchableOpacity>

      {/* Back */}
      <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 90,
  },
  iconBox: {
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#5B5F8D",
    marginBottom: 12,
  },
  text: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  email: {
    fontWeight: "600",
    color: "#5B5F8D",
  },
  note: {
    marginTop: 12,
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  primaryBtn: {
    marginTop: 40,
    backgroundColor: "#5B5F8D",
    paddingVertical: 14,
    borderRadius: 30,
    width: "85%",
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    marginTop: 16,
    paddingVertical: 12,
  },
  secondaryText: {
    color: "#5B5F8D",
    fontSize: 14,
    fontWeight: "600",
  },
  backText: {
    marginTop: 30,
    color: "#888",
    fontSize: 13,
  },
});
}