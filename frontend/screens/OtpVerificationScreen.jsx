import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";

import * as Animatable from "react-native-animatable";

// Get screen width dynamically
const { width } = Dimensions.get("window");

export default function OtpVerificationScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(10);

  const inputsRef = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleKeyPress = (num) => {
    const nextIndex = otp.findIndex((v) => v === "");
    if (nextIndex === -1) return;
    const newOtp = [...otp];
    newOtp[nextIndex] = num;
    setOtp(newOtp);
    if (nextIndex < 3) inputsRef[nextIndex + 1]?.current?.focus();
  };

  const handleBackspace = () => {
    const lastFilled = [...otp].reverse().findIndex((v) => v !== "");
    if (lastFilled === -1) return;
    const idx = 3 - lastFilled;
    const newOtp = [...otp];
    newOtp[idx] = "";
    setOtp(newOtp);
    inputsRef[idx]?.current?.focus();
  };

  // LOGO SIZE — responsive based on screen width
  const logoSize = width * 0.45; // 45% of screen width

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        {/*added fadeIn animation */}
        <Animatable.View animation="fadeInDown" duration={900} style={styles.logoWrapper}>
          <Image
            source={{uri:'https://www.bing.com/th/id/OIP.-MHxVaRWUStiVS8nNk_tuAHaGB?w=201&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&pid=3.1&rm=2&ucfimg=1'}}
            style={[styles.logo, { width: logoSize, height: logoSize }]}
            resizeMode="contain"
          />
        </Animatable.View>
        
        <Animatable.Text animation="fadeIn" duration={900} style={styles.title}>
            OTP verification
        </Animatable.Text>

        <Text style={styles.subText}>
          Enter the code we sent to your registered mail
        </Text>

        {/* OTP Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, i) => (
            <Animatable.View
            key={i}
            animation="zoomIn"
            delay={i*120}
            style={styles.otpBoxWrapper}
            >
                <TextInput
                  ref={inputsRef[i]}
                  value={digit}
                  editable={false}
                  style={styles.otpBox}
                  textAlign="center"
                />
            </Animatable.View>
           
          ))}
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn’t get the otp?</Text>

          <Text style={styles.resendTimer}>
            Resend code in: <Text style={styles.timer}>{timer}s</Text>
          </Text>
        </View>

        {/* Responsive Continue Button */}
        <TouchableOpacity style={styles.continueBtn} activeOpacity={0.8}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        {/* Keypad */}
        <View style={styles.keypad}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
            <Animatable.View
            key={n}
            animation="fadeInUp"
            delay={n*50}
            style={styles.keyWrapper}
            >
            <TouchableOpacity
              style={styles.key}
              onPress={() => handleKeyPress(n)}
            >
              <Text style={styles.keyText}>{n}</Text>
            </TouchableOpacity>
            </Animatable.View>
          ))}

          {/* placeholder */}
          <View style={[styles.key, { backgroundColor: "transparent" }]} />

          {/* zero */}
          <TouchableOpacity style={styles.key} onPress={() => handleKeyPress("0")}>
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>

          {/* backspace */}
          <TouchableOpacity style={styles.key} onPress={handleBackspace}>
            <Text style={styles.keyText}>⌫</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 18,
  },

  inner: {
    width: "100%",
    alignItems: "center",
  },

  logoWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 6,
  },

  logo: {
    // width & height added dynamically above
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#4A4F75",
    marginTop: 10,
    textAlign: "center",
  },

  subText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 6,
    color: "#666",
    paddingHorizontal: 28,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },

  otpBoxWrapper: {
    marginHorizontal: width * 0.03,
  },

  otpBox: {
   width: width * 0.16,
    height: width * 0.16,
    borderRadius: width * 0.04,
    backgroundColor: "#5A6285",
    color: "#fff",
       fontSize: width * 0.075,
    fontWeight: "700",
    textAlignVertical: "center",
    padding: 0,
  },

  resendRow: {
    marginTop: 18,
    alignItems: "center",
  },

  resendText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },

  resendTimer: {
    fontSize: 14,
    color: "#666",
  },

  timer: {
    fontWeight: "700",
    color: "#4A4F75",
  },

  continueBtn: {
    marginTop: 24,
    width: "85%", // responsive
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 36,
    backgroundColor: "#4A4F75",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },

  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  keypad: {
    marginTop: 28,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
   keyWrapper: {
    width: "30%",
    alignItems: "center",
  },

  key: {
    width: "100%",
    aspectRatio: 1.0,
    marginVertical: 8,
  borderRadius: width * 0.04,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  keyText: {
        fontSize: width * 0.075,
    fontWeight: "700",
    color: "#111",
  },
});
