import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please fill out all fields.");
      return;
    }
    router.replace("/(tabs)");
  };

  const handleLogin = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Hello</Text>
            <Text style={styles.headerText}>Create your</Text>
            <Text style={styles.headerText}>account !</Text>
          </View>

          {/* CARD */}
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput style={styles.input} value={name} onChangeText={setName} />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Gmail</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="yourname@gmail.com"
                    placeholderTextColor="#A7A7B7"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                  <Text style={styles.signUpButtonText}>SIGN UP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginText}>Login here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#383F78",
  },
 scrollContent: {
  flexGrow: 1,
  paddingTop: height * 0.06,
  paddingBottom: height * 0.03,
},

  /* HEADER */
  header: {
    paddingHorizontal: width * 0.08,
    marginBottom: height * 0.05,
  },
  headerText: {
    fontSize: width * 0.09,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: width * 0.11,
  },

  /* CARD */
 cardWrapper: {
  alignItems: "center",
  marginTop: height * 0.008,   
},

card: {
  width: width * 0.92,
  backgroundColor: "#F6F6F6",
  borderRadius: 42,
  transform: [{ rotate: "-9deg" }], 
  paddingVertical: height * 0.03,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.16,
  shadowRadius: 10,
  elevation: 8,
},

form: {
  transform: [{ rotate: "9deg" }],
  paddingHorizontal: width * 0.085,
  paddingTop: height * 0.015,
},

  inputGroup: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.038,
    color: "#383F78",
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#CFCFDB",
    paddingVertical: 8,
    fontSize: width * 0.04,
    color: "#333",
  },

  signUpButton: {
    marginTop: height * 0.015,
    backgroundColor: "#5B5F8D",
    borderRadius: 28,
    paddingVertical: height * 0.018,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#FFF",
    fontSize: width * 0.04,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  /* FOOTER */
  footer: {
  alignItems: "center",
  marginTop: height * 0.035, 
},
  footerText: {
    color: "#FFF",
    fontSize: width * 0.037,
  },
  loginText: {
    color: "#FFF",
    fontSize: width * 0.037,
    fontWeight: "700",
    marginTop: 4,
    textDecorationLine: "underline",
  },
});
