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
import { loginWithPassword } from "../../services/auth";



const { width, height } = Dimensions.get("window");
const logoSize = 100;

export default function LoginScreen() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please enter both email and password.");
      return;
    }

    try {
      await loginWithPassword(email, password);
      router.replace("/(tabs)");
    } catch (err) {
      Alert.alert("Login Failed", err.message);
    }
  };

  const handleForgotPassword = () =>
    router.push({ pathname: "/(auth)/otp", params: { email } });

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
               <View style={[
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
  />
</View>

                {/* PASSWORD */}
                <Text style={styles.label}>Password</Text>
               <View style={[
    styles.inputBox,
    focusedInput === "password" && styles.inputFocused,
  ]}>
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

  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.6}>
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
                  style={styles.button}
                  onPress={handleLogin}
                >
                  <Text style={styles.buttonText}>LOGIN</Text>
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
                  <Text style={styles.googleText}>
                    Login with Google
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          

        {/* ================= FOOTER ================= */}
        <View style={styles.footerBox}>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.footerTitle}>
              Don't have an account?
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerSubtitle}>
            Sign up with social media
          </Text>

 <View style={styles.socialRow}>
  {[
    "https://logos-world.net/wp-content/uploads/2020/06/Instagram-Logo.png",
    "https://static.vecteezy.com/system/resources/previews/018/930/745/original/twitter-logo-twitter-icon-transparent-free-free-png.png",
    "https://th.bing.com/th/id/OIP.sLFgKczZ7c771m9TOYCyCwHaFL?w=250",
  ].map((uri, i) => (
    <View key={i} style={styles.socialIcon}>
      <Image
        source={{ uri }}
        style={styles.socialImage}
        resizeMode="contain"
      />
    </View>
  ))}
</View>


        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: height * 0.08,
    paddingBottom: 40,
  },

 
 

form: {
  paddingHorizontal: 10,
},

  label: {
    marginTop: 20,
    fontWeight: "600",
    color: "#383F78",
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

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },

  footer: {
    alignItems: "center",
    marginTop: 10,
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
logo: {},

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
rememberText: {
  fontSize: 12,
  color: "#999",
},
forgotTextRed: {
  fontSize: 12,
  color: "#E64B4B",
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
  shadowColor: "#000",
  shadowOpacity: 0.15,
},

googleText: {
  fontWeight: "600",
},
container: {
  flex: 1,
  backgroundColor: "#FFFFFF",
},

middle: {
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: 30,
  transform: [{ translateY: -30 }], // 👈 move towards logo
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
  textDecorationStyle: "solid"
},

footerSubtitle: {
  color: "#E0E0E0",
  fontSize: 12,
  marginBottom: 14,
},

socialRow: {
  flexDirection: "row",
},

socialIcon: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#FFFFFF",
  marginHorizontal: 8,
  justifyContent: "center",
  alignItems: "center",
},
socialImage: {
  width: 22,
  height: 22,
},
checkboxChecked: {
  backgroundColor: "#5B5F8D",
  borderColor: "#5B5F8D",
},


});
