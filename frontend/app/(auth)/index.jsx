import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function AuthHome() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
      
      <Image
        source={require("../../assets/kucc-logo.png")}
        style={{ width: 220, height: 220, marginBottom: 20 }}
        resizeMode="contain"
      />

      <Text style={{ fontSize: 18, color: "#5B5F8D", marginBottom: 30 }}>
        KUCC-App
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/signup")}
        style={{
          backgroundColor: "#5B5F8D",
          paddingVertical: 14,
          width: 220,
          borderRadius: 25,
          marginBottom: 12
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>SIGN UP</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        style={{
          borderColor: "#5B5F8D",
          borderWidth: 1,
          paddingVertical: 14,
          width: 220,
          borderRadius: 25
        }}
      >
        <Text style={{ color: "#5B5F8D", textAlign: "center" }}>LOGIN</Text>
      </TouchableOpacity>

    </View>
  );
}
