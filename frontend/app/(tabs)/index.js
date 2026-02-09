import { useUser } from "@clerk/clerk-expo";
import { Text, View, StyleSheet } from "react-native";

export default function Home() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to KUCC App!</Text>
      {user && (
        <>
          <Text style={styles.info}>Email: {user.primaryEmailAddress?.emailAddress}</Text>
          <Text style={styles.info}>
            Name: {user.unsafeMetadata?.name || "Not provided"}
          </Text>
          <Text style={styles.info}>
            Phone: {user.unsafeMetadata?.phone || "Not provided"}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "700",
    color: "#383F78",
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
});