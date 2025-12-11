import { Tabs } from "expo-router";
import CustomTabBar from "../../components/navbar";
import SignupScreen from "../../screens/SignupScreen";
import LoginScreen from "../../screens/LoginScreen";
import OtpVerificationScreen from "../../screens/OtpVerificationScreen";

export default function TabLayout() {
  
  const TEST_SIGNUP = true; // change to false later

  if (TEST_SIGNUP) {
    return <OtpVerificationScreen/>;   // <--- ONLY SIGNUP SCREEN RENDERS
  }else{
    return <SignupScreen/> || <LoginScreen/>;
  }


  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="notification" />
      <Tabs.Screen name="about" />
    </Tabs>
  );
}
