import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EventCard from "../components/EventCard";

export default function Events() {
  const router = useRouter();
  const [tab, setTab] = useState("Ongoing");

  const events = {
    Ongoing: [
      {
        id: "techfest-2025",
        title: "Annual Tech Fest 2025",
        date: "Dec 15–17, 2025",
        participants: "250+ participants",
        status: "OPEN",
      },
    ],
    Upcoming: [
      {
        id: "webdev-2025",
        title: "Web Development MasterClass",
        date: "Oct 5, 2025",
        participants: "200 participants",
        status: "OPEN",
      },
      {
        id: "opensource-2025",
        title: "Open Source Contribution",
        date: "Dec 5, 2025 · 2:00 PM",
        participants: "30 seats left",
        status: "OPEN",
      },
    ],
    Past: [
      {
        id: "hackathon-2024",
        title: "Hackathon 2024",
        date: "Dec 2024",
        participants: "100+ participants",
        status: "ENDED",
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Events</Text>
        <View style={{ width: 24 }} /> {/* spacer */}
      </View>

      {/* TABS */}
      <View style={styles.tabsWrapper}>
        {["Ongoing", "Upcoming", "Past"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {events[tab].map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },

  /* HEADER */
  header: {
    backgroundColor: "#2F346E",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  /* TABS */
  tabsWrapper: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#3C3F8F",
  },

  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3C3F8F",
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  /* CONTENT */
  content: {
    padding: 20,
    paddingTop: 25,
  },
});
