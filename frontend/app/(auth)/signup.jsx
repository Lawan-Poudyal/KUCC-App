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
import { useSignUp,useAuth } from "@clerk/clerk-expo"; 



const { width, height } = Dimensions.get("window");
const logoSize = 100;

export default function SignUpScreen() {
  const {isLoaded, signUp, setActive}=useSignUp();
  const { getToken } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [focusedInput, setFocusedInput] = useState(null);
const  [loading, setLoading] = useState(false);
const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");


const handleSignUp = async () => {
  if (!name || !phone || !email || !password) {
    Alert.alert("Missing Information", "Please fill all fields.");
    return;
  }

  if (password.length < 8) {
    Alert.alert("Weak Password", "Password must be at least 8 characters.");
    return;
  }

  // ✅ Check if Clerk is loaded AND signUp exists
  if (!isLoaded || !signUp) {
    Alert.alert("Error", "Authentication service is not ready. Please try again.");
    return;
  }

  try {
    setLoading(true);

    // Start sign-up process using email and password provided
    await signUp.create({
      emailAddress: email,
      password,
      unsafeMetadata: {
        name,
        phone,
      },
    });

    // Send user an email with verification code
    await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

    // Set 'pendingVerification' to true to display verification form
    setPendingVerification(true);
  } catch (err) {
    console.error("Signup Error:", JSON.stringify(err, null, 2));
    
    // ✅ Better error handling
    let errorMessage = "An error occurred during signup";
    
    if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      errorMessage = err.errors[0].message;
    } else if (err?.message) {
      errorMessage = err.message;
    }

    // Make password breach error more user-friendly
    if (errorMessage.includes("found in an online data breach")) {
      errorMessage = "This password has been compromised in a data breach. Please choose a stronger, unique password.";
    }

    Alert.alert("Signup failed", errorMessage);
  } finally {
    setLoading(false);
  }
};

// handle submission of verification form

const onVerifyPress = async () => {
  if (!isLoaded || !signUp) {
    Alert.alert("Error", "Authentication service is not ready. Please try again.");
    return;
  }

  try {
    setLoading(true);

    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code,
    });

    if (signUpAttempt.status === "complete") {
      await setActive({ session: signUpAttempt.createdSessionId });
      
      console.log('🔄 Starting user sync...');
      
      // ✅ WAIT for sync to complete BEFORE navigating
      try {
        let token = null;
        let retries = 0;
        const maxRetries = 5;
        
        // Retry getting token if not immediately available
        while (!token && retries < maxRetries) {
          console.log(`🔑 Attempt ${retries + 1} to get token...`);
          token = await getToken();
          if (!token) {
            await new Promise(resolve => setTimeout(resolve, 300));
            retries++;
          }
        }
        
        if (!token) {
          console.error('❌ Failed to get token after', maxRetries, 'retries');
          Alert.alert("Warning", "Account created but sync may be delayed. Please restart the app if data doesn't appear.");
          router.replace("/(tabs)");
          return;
        }
        
        console.log('✅ Token obtained, calling sync API...');
        console.log('🌐 API URL:', process.env.EXPO_PUBLIC_API_URL);
        
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/sync`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Response status:', response.status);
        
        const responseData = await response.json();
        console.log('📦 Response data:', responseData);
        
        if (response.ok) {
          console.log('✅ New user synced to Supabase:', responseData);
          Alert.alert("Success", "Account created successfully!");
        } else {
          console.error('❌ Sync failed with status:', response.status);
          console.error('❌ Error details:', responseData);
          Alert.alert("Warning", "Account created but sync failed. Your data may not be available yet.");
        }
      } catch (syncError) {
        console.error('❌ Sync error:', syncError);
        console.error('❌ Error details:', syncError.message);
        Alert.alert("Warning", "Account created but sync encountered an error.");
      }
      
      router.replace("/(tabs)");
    } else {
      console.error("Verification incomplete:", JSON.stringify(signUpAttempt, null, 2));
      Alert.alert("Verification Failed", "Please try again.");
    }
  } catch (err) {
    console.error("Verification Error:", JSON.stringify(err, null, 2));
    
    let errorMessage = "Invalid verification code";
    if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      errorMessage = err.errors[0].message;
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    Alert.alert("Verification Failed", errorMessage);
  } finally {
    setLoading(false);
  }
};

  // if  pending verification, show verification form
  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 30 }}>
            <Text style={styles.verifyTitle}>Verify your email</Text>
            <Text style={styles.verifyDescription}>
              A verification code has been sent to {email}
            </Text>

            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color="#383F78" />
              <TextInput
                style={styles.textInput}
                value={code}
                placeholder="Enter verification code"
                placeholderTextColor="#999"
                onChangeText={setCode}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={onVerifyPress}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "VERIFYING..." : "VERIFY"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 20, alignSelf: "center" }}
              onPress={() => setPendingVerification(false)}
            >
              <Text style={{ color: "#5B5F8D" }}>Go back</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
              placeholder=" Full Name"
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
              placeholder="Phone Number"
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
              placeholder="Email Address"
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
              placeholder="Password (min 8 characters)"
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
          <TouchableOpacity
           style={[styles.button, loading && styles.buttonDisabled]} 
           onPress={handleSignUp}
           disabled={loading}
           >
            <Text style={styles.buttonText}>
              {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
            </Text>
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

  buttonDisabled:{
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
  verifyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#383F78",
    marginBottom: 10,
    textAlign: "center",
  },

  verifyDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },

});