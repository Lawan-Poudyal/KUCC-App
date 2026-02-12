// frontend/components/EventCard.js

import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EventCard({ event }) {
  const router = useRouter();

  const isPast = event.status === "completed";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: `/events/${event.id}`,
        })
      }
      activeOpacity={0.8}
    >
      {/* LEFT */}
      <View style={styles.left}>
        <Text style={styles.eventTitle}>{event.title}</Text>

        <Text style={styles.eventInfo}>📅 {event.event_date}</Text>

        <Text style={styles.eventInfo}>⏰ {event.event_time}</Text>

        <Text style={styles.eventInfo}>📍 {event.location}</Text>

        <Text style={styles.eventInfo}>👥 Max: {event.max_participants}</Text>
      </View>

      {/* RIGHT */}
      <View style={styles.right}>
        <Text style={isPast ? styles.statusEnded : styles.statusOpen}>
          {isPast ? "Past" : "Upcoming"}
        </Text>

        <Text style={styles.detailsText}>View Details</Text>
      </View>
    </TouchableOpacity>
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

  detailsText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#3C3F8F",
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
