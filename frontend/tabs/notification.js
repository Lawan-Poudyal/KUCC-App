import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Notification Data
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

export default function NotificationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={26} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Notifications</Text>

        <Ionicons name="notifications-outline" size={24} color="#333" />
      </View>

      {/* Clear All */}
      <TouchableOpacity style={styles.clearButton}>
        <Text style={styles.clearText}>Clear all</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Today */}
        <Text style={styles.sectionTitle}>Today</Text>
        {notifications.today.map((item, index) => (
          <NotificationCard key={index} item={item} />
        ))}

        {/* Earlier This Week */}
        <Text style={styles.sectionTitle}>Earlier this week</Text>
        {notifications.weekly.map((item, index) => (
          <NotificationCard key={index} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

// Notification Card Component
function NotificationCard({ item }) {
  return (
    <TouchableOpacity activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.bulletPoint} />

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
        </View>

        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },

  clearButton: {
    alignSelf: "flex-end",
    marginVertical: 10,
  },

  clearText: {
    color: "#5a6efb",
    fontWeight: "500",
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
    color: "#222",
  },

  /* Updated Card with Shadow */
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,

    // Shadow for Android + iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  bulletPoint: {
    width: 8,
    height: 8,
    backgroundColor: "#5a6efb",
    borderRadius: 100,
    marginRight: 12,
    marginTop: 6,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },

  cardDesc: {
    fontSize: 13,
    color: "#555",
  },

  timeText: {
    marginLeft: 10,
    fontSize: 12,
    color: "#777",
    alignSelf: "flex-end", // improved alignment
  },
});

