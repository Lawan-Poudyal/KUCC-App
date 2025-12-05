import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BottomNavBar({ active }) {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <NavItem
        icon="home-outline"
        label="Home"
        active={active === "home"}
        onPress={() => router.push("/")}
      />

      <NavItem
        icon="information-circle-outline"
        label="About"
        active={active === "about"}
        onPress={() => router.push("/(tabs)/about")}
      />

      <NavItem
        icon="notifications-outline"
        label="Notification"
        active={active === "notification"}
        onPress={() => router.push("/(tabs)/notification")}
      />

      <NavItem
        icon="person-outline"
        label="Profile"
        active={active === "profile"}
        onPress={() => router.push("/(tabs)/profile")}
      />

    </View>
  );
}

function NavItem({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons
        name={icon}
        size={24}
        color={active ? "#4662E8" : "gray"}
      />
      <Text style={[styles.label, active && { color: "#4662E8" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 75,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",

    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
  },

  item: {
    alignItems: "center",
  },

  label: {
    fontSize: 12,
    marginTop: 2,
    color: "gray",
  },
});
