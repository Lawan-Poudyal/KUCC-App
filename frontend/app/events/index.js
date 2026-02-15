// frontend/app/events.js

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import EventCard from "../../components/EventCard";
import ScreenWrapper from "../../components/ScreenWrapper";
import { fetchEvents } from "../../services/eventsApi";

export default function Events() {
  const router = useRouter();
  const [tab, setTab] = useState("Upcoming");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        if (data) {
          // remove drafts
          const filtered = data.filter((event) => event.status !== "draft");
          setEvents(filtered);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Separate Upcoming and Past
  const upcomingEvents = events.filter((event) => event.status === "active");

  const pastEvents = events.filter((event) => event.status === "completed");

  // debug
  // console.log("All events:", events);
  // console.log("Upcoming:", upcomingEvents.length);
  // console.log("Past:", pastEvents.length);

  const displayedEvents = tab === "Upcoming" ? upcomingEvents : pastEvents;

  return (
    <>
      <ScreenWrapper backgroundColor="#2F346E" statusBarStyle="light">
        <View style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Events</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* TABS */}
          <View style={styles.tabsWrapper}>
            {["Upcoming", "Past"].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tab, tab === t && styles.activeTab]}
                onPress={() => setTab(t)}
              >
                <Text
                  style={[styles.tabText, tab === t && styles.activeTabText]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CONTENT */}
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 40 }} />
          ) : (
            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {displayedEvents.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  No events found.
                </Text>
              ) : (
                displayedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              )}
            </ScrollView>
          )}
        </View>
      </ScreenWrapper>
    </>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 15, // small internal spacing only
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
