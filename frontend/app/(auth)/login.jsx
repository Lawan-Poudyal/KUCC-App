import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert, Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = () => {
  if (!email.trim() || !password.trim()) {
    Alert.alert(
      "Missing Information",
      "Please enter both email and password."
    );
    return;
  }

  // TEMP: replace with real auth later
  const isValidUser = email === "test@gmail.com" && password === "123456";

  if (!isValidUser) {
    Alert.alert(
      "Login Failed",
      "Invalid email or password."
    );
    return;
  }

  router.replace("/(tabs)");
};

  const handleForgotPassword = () =>
    router.push({ pathname: "/(auth)/otp", params: { email } });

  return (
    <LinearGradient
      colors={["#383F78", "#5B5F8D"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.headerText}>Hello</Text>
              <Text style={styles.headerText}>Login Here!</Text>
            </View>

            {/* TILTED CARD */}
            <View style={styles.cardWrapper}>
              <View style={styles.card}>
                {/* COUNTER ROTATED FORM */}
                <View style={styles.form}>
                  <Text style={styles.label}>Gmail</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="yourname@gmail.com"
                    placeholderTextColor="#A2A2A2"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />

                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />

                  <TouchableOpacity
                    style={styles.forgot}
                    onPress={handleForgotPassword}
                  >
                    <Text style={styles.forgotText}>forgot password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                  >
                    <Text style={styles.buttonText}>LOGIN</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
  {/* Signup navigation */}
  <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
    <Text style={styles.signupText}>
      Don’t have an account?
    </Text>
  </TouchableOpacity>

  {/* Social label */}
  <Text style={styles.socialLabel}>
    Sign up with social media
  </Text>


              <View style={styles.socialRow}>
                {[
                  "https://logos-world.net/wp-content/uploads/2020/06/Instagram-Logo.png",
                  "https://static.vecteezy.com/system/resources/previews/018/930/745/original/twitter-logo-twitter-icon-transparent-free-free-png.png",
                  "https://th.bing.com/th/id/OIP.sLFgKczZ7c771m9TOYCyCwHaFL?w=250",
                ].map((uri, i) => (
                  <View key={i} style={styles.socialIcon}>
                    <Image source={{ uri }} style={{ width: 22, height: 22 }} />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: height * 0.08,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 40,
  },
  headerText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#F0EFEF",
    lineHeight: 40,
  },

  cardWrapper: {
    alignItems: "center",
    marginBottom: 40,
  },

  card: {
    width: 340,
    height: 420,
    backgroundColor: "#F9F9F9",
    borderRadius: 50,
    transform: [{ rotate: "-15deg" }],
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  form: {
    flex: 1,
    padding: 30,
    transform: [{ rotate: "15deg" }],
  },

  label: {
    marginTop: 20,
    fontWeight: "600",
    color: "#383F78",
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#aaa",
    paddingVertical: 6,
    fontSize: 14,
  },

 forgot: {
  alignSelf: "center",
  marginTop: 10,
},

  forgotText: {
    fontSize: 12,
    color: "#A2A2A2",
  },

  button: {
    backgroundColor: "#5B5F8D",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },

  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    color: "#F0EFEF",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 15,
  },

  socialRow: {
    flexDirection: "row",
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    
  },
  signupText: {
  color: "#FFFFFF",
  fontSize: 14,
  marginBottom: 6,
  textDecorationLine: "underline",
},

});
