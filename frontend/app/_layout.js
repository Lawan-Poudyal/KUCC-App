import { Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { AuthProvider } from "../context/AuthContext";

WebBrowser.maybeCompleteAuthSession(); 

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
