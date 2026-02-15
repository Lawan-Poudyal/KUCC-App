// frontend/app/(tabs)/index.js
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EventCard from "../../components/EventCard"; // make sure this is imported
import ScreenWrapper from "../../components/ScreenWrapper";
import { fetchEvents } from "../../services/eventsApi";
import { getProfileApi } from "../../services/profileApi";
export default function Homepage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    semester: "",
    batch: "",
    isProfileComplete: false,
    isMember: false,
  });

  const loadData = async () => {
    try {
      const eventsData = await fetchEvents();
      if (eventsData) {
        const filtered = eventsData.filter((event) => event.status !== "draft");
        setEvents(filtered);
      }

      const token = await getToken();
      const profileData = await getProfileApi(token);

      if (!profileData.is_profile_complete) {
        router.replace("/edit");
        return;
      }

      setProfile({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        program: profileData.program || "",
        semester: profileData.semester || "",
        batch: profileData.batch || "",
        isProfileComplete: profileData.is_profile_complete || false,
        isMember: profileData.is_member || false,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  const upcomingEvent = events
    .filter((event) => event.status === "active")
    .slice(0, 3);

  return (
    <ScreenWrapper statusBarStyle="light" backgroundColor="#2F346E">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Welcome, {user?.unsafeMetadata?.name}
          </Text>
          <Text style={styles.subGreeting}>Lets start exploring</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Upcoming Events */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <TouchableOpacity onPress={() => router.push("/events")}>
                <Text style={styles.viewAll}>View All →</Text>
              </TouchableOpacity>
            </View>
            {upcomingEvent.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No upcoming events found.
              </Text>
            ) : (
              upcomingEvent.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() =>
                    router.push({
                      pathname: "/events/register",
                      params: event,
                    })
                  }
                />
              ))
            )}
          </View>

          {/* Join KUCC */}

          {!profile.isMember ? (
            <>
              <TouchableOpacity
                style={styles.joinCard}
                onPress={() => router.push("/membership")}
              >
                <Text style={styles.joinText}>Join KUCC</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6E6E6" },

  header: {
    backgroundColor: "#2f346e",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: { color: "#FFF", fontSize: 24, fontWeight: "700" },
  subGreeting: { color: "#FFF", fontSize: 14, marginBottom: 15 },
  search: {
    backgroundColor: "#F7EDED",
    borderRadius: 25,
    padding: 12,
  },

  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },

  eventCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    marginBottom: 10,
  },
  smallCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    elevation: 2,
  },

  badge: {
    backgroundColor: "#3C3F8F",
    color: "#FFF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    marginBottom: 8,
  },

  eventTitle: { fontSize: 15, fontWeight: "700", marginBottom: 6 },
  eventInfo: { fontSize: 12, color: "#555", marginBottom: 3 },

  primaryButton: {
    backgroundColor: "#3C3F8F",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 15,
  },
  primaryButtonText: { color: "#FFF", fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  viewAll: {
    fontSize: 13,
    color: "#4F5BD5",
    fontWeight: "600",
  },
  statusEnded: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#B0B0B0",
    color: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: "600",
  },
  statusOpen: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#3C3F8F",
    color: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#3C3F8F",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  secondaryButtonText: { color: "#FFF", fontSize: 12, fontWeight: "600" },

  /* Join KUCC */
  joinCard: {
    backgroundColor: "#3C3F8F",
    marginHorizontal: 20,
    marginVertical: 30,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  joinText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  joinSubText: {
    color: "#FFFFFF",
    fontSize: 13,
    marginTop: 5,
    textDecorationLine: "underline",
  },
});
