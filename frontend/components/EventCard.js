import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function EventCard({ event }) {
  const router = useRouter();
  const isEnded = event.status === "ENDED";

  return (
    <View style={styles.card}>
      {/* LEFT */}
      <View style={styles.left}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventInfo}>📅 {event.date}</Text>

        {event.time && (
          <Text style={styles.eventInfo}>⏰ {event.time}</Text>
        )}

        {event.location && (
          <Text style={styles.eventInfo}>📍 {event.location}</Text>
        )}

        <Text style={styles.eventInfo}>👥 {event.participants}</Text>
      </View>

      {/* RIGHT */}
      <View style={styles.right}>
        <Text style={isEnded ? styles.statusEnded : styles.statusOpen}>
          {event.status}
        </Text>

        {isEnded ? (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              router.push({
                pathname: "/certificates",
                params: event,
              })
            }
          >
            <Text style={styles.secondaryButtonText}>
              View Certificate
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              router.push({
                pathname: "/register",
                params: event,
              })
            }
          >
            <Text style={styles.secondaryButtonText}>Register</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },

  left: {
    flex: 1,
    paddingRight: 10,
  },

  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  eventTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1F1F1F",
  },

  eventInfo: {
    fontSize: 12,
    color: "#555555",
    marginBottom: 3,
  },

  secondaryButton: {
    backgroundColor: "#3C3F8F",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 10,
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  statusOpen: {
    backgroundColor: "#3C3F8F",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: "600",
  },

  statusEnded: {
    backgroundColor: "#B0B0B0",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: "600",
  },
});
