import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
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
        "Registration for Tech Talk 2025 is now open! Seats are limited. Make sure to register before Dec 5, 2025.",
      time: "2 hr",
    },
    {
      title: "Club meeting today at 3 PM.",
      description: "This is a reminder for today's club meeting at 3:00 PM.",
      time: "5 hr",
    },
    {
      title: "New volunteering opportunity available.",
      description:
        "Our club is partnering with KU Welfare Cell for a volunteering initiative.",
      time: "18 hr",
    },
  ],
  weekly: [
    {
      title: "Your event payment is confirmed.",
      description: "We've received your payment for Hackfest 2025.",
      time: "3d",
    },
    {
      title: "Your club membership has been approved.",
      description:
        "Congratulations! Your membership request for KUCC has been approved.",
      time: "5d",
    },
  ],
};

export default function NotificationScreen() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  function openNotification(item) {
    setLoading(true);

    setTimeout(() => {
      setSelectedNotification(item);
      setLoading(false);
    }, 2000); // simulate loading
  }

  function goBack() {
    setSelectedNotification(null);
  }

  /* ---------------- FULL SCREEN LOADER ---------------- */
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5A67F8" />
        <Text style={styles.loadingText}>
          Generating notification details...
        </Text>
      </View>
    );
  }

  /* ---------------- DETAIL VIEW ---------------- */
  if (selectedNotification) {
    return (
      <View style={styles.detailContainer}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        <Ionicons
          name="notifications-outline"
          size={60}
          color="#5A67F8"
          style={{ marginBottom: 20 }}
        />

        <Text style={styles.detailTitle}>
          {selectedNotification.title}
        </Text>
        <Text style={styles.detailTime}>
          {selectedNotification.time}
        </Text>

        <Text style={styles.detailDesc}>
          {selectedNotification.description}
        </Text>
      </View>
    );
  }

  /* ---------------- MAIN LIST (UNCHANGED STRUCTURE) ---------------- */
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
          <NotificationCard
            key={index}
            item={item}
            onPress={() => openNotification(item)}
          />
        ))}

        {/* Earlier */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
          Earlier this week
        </Text>
        {notifications.weekly.map((item, index) => (
          <NotificationCard
            key={index}
            item={item}
            onPress={() => openNotification(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------------- CARD (UNCHANGED + onPress) ---------------- */
function NotificationCard({ item, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES (ORIGINAL + ADDED) ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F9",
    paddingTop: 55,
    paddingHorizontal: 18,
  },

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

  clearButton: {
    alignSelf: "flex-end",
    marginVertical: 8,
  },

  clearText: {
    color: "#5A67F8",
    fontWeight: "500",
    fontSize: 14,
  },

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

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
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

  /* LOADER */
  loaderContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: "#555",
  },

  /* DETAIL */
  detailContainer: {
    flex: 1,
    backgroundColor: "#F7F7F9",
    paddingTop: 70,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    top: 55,
    left: 18,
  },

  detailTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  detailTime: {
    fontSize: 12,
    color: "#777",
    marginBottom: 20,
  },

  detailDesc: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    textAlign: "center",
  },
});
