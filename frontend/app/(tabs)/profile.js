import { useUser, useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)");
          } catch (err) {
            console.error("Sign out error:", err);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.name}>
          {user?.unsafeMetadata?.name || "User"}
        </Text>
        <Text style={styles.email}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#5B5F8D" />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color="#5B5F8D" />
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>
            {user?.unsafeMetadata?.phone || "Not provided"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#5B5F8D" />
          <Text style={styles.infoLabel}>User ID</Text>
          <Text style={styles.infoValue}>{user?.id}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#5B5F8D",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#383F78",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#E0E0E0",
  },
  infoSection: {
    padding: 20,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DADAEA",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 15,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#383F78",
    fontWeight: "500",
    flex: 2,
  },
  signOutButton: {
    flexDirection: "row",
    backgroundColor: "#E64B4B",
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});