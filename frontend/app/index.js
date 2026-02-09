import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading while checking auth state
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5B5F8D" />
      </View>
    );
  }

  // Redirect based on authentication state
  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return <Redirect href="/(tabs)" />;
}