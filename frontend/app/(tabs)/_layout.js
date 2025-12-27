import { Tabs } from "expo-router";
import CustomTabBar from "../../components/navbar";

export default function TabLayout() {
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
