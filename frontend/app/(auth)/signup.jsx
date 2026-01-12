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
import { signUpWithPassword } from "../../services/auth";


const { width, height } = Dimensions.get("window");
const logoSize = 100;

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
const [focusedInput, setFocusedInput] = useState(null);


 const handleSignUp = async () => {
    if (!name || !phone || !email || !password) {
      Alert.alert("Missing Information", "Please fill all fields.");
      return;
    }

  try {
   await signUpWithPassword(email, password, name, phone);
    Alert.alert("Success", "Account created successfully");
    router.replace("/(auth)/login");
  } catch (err) {
    Alert.alert("Signup failed", err.message);
  }
};

  const handleLogin = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ===== TOP ===== */}
        <View>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeText}>Hello</Text>
            <Text style={styles.welcomeText}>Create your account!</Text>
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

        {/* ===== FORM ===== */}
        <View style={styles.middle}>
          {/* NAME */}
          <View
            style={[
              styles.inputBox,
              focusedInput === "name" && styles.inputFocused,
            ]}
          >
            <Ionicons name="person-outline" size={18} color="#383F78" />
            <TextInput
              style={styles.textInput}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* PHONE */}
          <View
            style={[
              styles.inputBox,
              focusedInput === "phone" && styles.inputFocused,
            ]}
          >
            <Ionicons name="call-outline" size={18} color="#383F78" />
            <TextInput
              style={styles.textInput}
              placeholder="Phone"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocusedInput("phone")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* EMAIL */}
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
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          {/* PASSWORD */}
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
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={18}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* SIGNUP BUTTON */}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>

          {/* OR */}
          <View style={styles.orRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* GOOGLE */}
          <TouchableOpacity style={styles.googleBtn}>
            <Image
              source={{
                uri: "https://developers.google.com/identity/images/g-logo.png",
              }}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <Text style={styles.googleText}>Sign up with Google</Text>
          </TouchableOpacity>
        </View>

        {/* ===== FOOTER ===== */}
        <View style={styles.footerBox}>
         
            <Text style={styles.footerTitle}>Already have an account?</Text>
        
          
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                    <Text style={styles.footerSubtitle}>
                     login here
                    </Text>
                    </TouchableOpacity>
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
    paddingVertical: 40,
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
    marginBottom: 10,
  },

  middle: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    transform: [{ translateY: -32 }],
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

  inputFocused: {
    borderColor: "#5B5F8D",
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
    width: 160,
    alignSelf: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },

  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },

  orText: {
    marginHorizontal: 10,
    color: "#999",
  },

  googleBtn: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  googleText: {
    fontWeight: "600",
  },

 
  footerBox: {
  backgroundColor: "#5B5F8D",
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  paddingVertical: 35,
  alignItems: "center",
},
footerSubtitle: {
  color: "#FFFFFF",
  fontSize: 12,
  marginBottom: 14,
     textDecorationLine: "underline",
},

  footerTitle: {
    color: "#FFFFFF",
    fontSize: 13,
   
  },
});
