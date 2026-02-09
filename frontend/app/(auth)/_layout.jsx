import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function AuthLayout() {
  // Remove all auth checks from here
  // Protection is handled at the root level
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}