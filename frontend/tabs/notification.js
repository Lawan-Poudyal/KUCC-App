import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const notifications = {
  today: [
    {
      title: "Registration open for Tech Talk 2025!",
      description:
        "Registration for Tech Talk 2025 is now open! Seats are limited. Make sure to register before...",
      time: "2 hr",
    },
    {
      title: "Club meeting today at 3 PM.",
      description: "This is a reminder for today's club meeting at 3:00 PM...",
      time: "5 hr",
    },
    {
      title: "New volunteering opportunity available.",
      description:
        "Our club is partnering with KU Welfare Cell for a volunteering initiative...",
      time: "18 hr",
    },
  ],

  weekly: [
    {
      title: "Your event payment is confirmed.",
      description: "We've received your payment for Hackfest 2025...",
      time: "3d",
    },
    {
      title: "Your club membership has been approved.",
      description:
        "Congratulations! Your membership request for KUCC has been approved...",
      time: "5d",
    },
  ],
};

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <Ionicons name="notifications-outline" size={26} color="#333" />
      </View>

      {/* Clear all */}
      <TouchableOpacity style={styles.clearButton}>
        <Text style={styles.clearText}>Clear all</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Today */}
        <Text style={styles.sectionTitle}>Today</Text>
        {notifications.today.map((item, index) => (
          <NotificationCard key={index} item={item} />
        ))}

        {/* Earlier */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
          Earlier this week
        </Text>
        {notifications.weekly.map((item, index) => (
          <NotificationCard key={index} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

function NotificationCard({ item }) {
  return (
    <TouchableOpacity activeOpacity={0.8}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F9",
    paddingTop: 55,
    paddingHorizontal: 18,
  },

  /** HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },

  /** CLEAR BUTTON */
  clearButton: {
    alignSelf: "flex-end",
    marginVertical: 8,
  },

  clearText: {
    color: "#5A67F8",
    fontWeight: "500",
    fontSize: 14,
  },

  /** SECTIONS */
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
    marginTop: 10,
  },

  scrollContainer: {
    paddingBottom: 150,
  },

  /** NOTIFICATION CARDS */
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,

    // Soft iOS-style shadow
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    color: "#222",
  },

  cardDesc: {
    fontSize: 13,
    color: "#555",
    marginBottom: 10,
  },

  timeText: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
    fontStyle: "italic",
  },
});
