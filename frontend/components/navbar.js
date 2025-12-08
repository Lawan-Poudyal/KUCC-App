import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomTabBar({ state, navigation }) {
  const tabs = [
    { name: "index", label: "Home", icon: "home-outline" },
    { name: "about", label: "About", icon: "star-outline" },
    { name: "notification", label: "Notification", icon: "notifications-outline" },
    { name: "profile", label: "Profile", icon: "person-outline" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const active = state.index === index;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={active ? "#3C4DB0" : "#B9BCC5"}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { height: 4 },
    elevation: 6,
  },

  tab: {
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 12,
    color: "#B9BCC5",
    marginTop: 4,
    fontWeight: "600",
  },

  labelActive: {
    color: "#3C4DB0",
  },
});
