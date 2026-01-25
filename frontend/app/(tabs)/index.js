import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Homepage() {
  const router = useRouter();
  const { success } = useLocalSearchParams();

  // Dummy event data (single source of truth)
const ongoingEvents = [
  {
    id: "techfest-2025",
    title: "Annual Tech Fest 2025",
    date: "December 15–17, 2025",
    time: "9:00 AM – 6:00 PM",
    location: "Main Auditorium, KU Campus",
    participants: "250+ participants expected",
    status: "OPEN",
  },
  {
    id: "hackfest-2025",
    title: "KU Hackfest",
    date: "Nov 5, 2025",
    time: "11:00 AM",
    location: "Multipurpose Hall",
    participants: "200+ participants",
    status: "ENDED",
  },
];

  const upcomingEvent = {
    id: "opensource-2025",
    title: "Open Source Contribution",
    date: "Dec 5, 2025",
    time: "2:00 PM",
    location: "Conference Hall",
    participants: "30 seats left",
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {success && (
        <Text style={{ fontSize: 12, fontWeight: "500", color: "#383F78" }}>
          {success}
        </Text>
      )}
    </View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey, John Doe</Text>
        <Text style={styles.subGreeting}>Lets start exploring</Text>

        <TextInput
          placeholder="Search anything"
          placeholderTextColor="#9E9E9E"
          style={styles.search}
        />
      </View>

      {/* Ongoing Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Ongoing Events</Text>
  <TouchableOpacity onPress={() => router.push("/events")}>
    <Text style={styles.viewAll}>View All →</Text>
  </TouchableOpacity>
</View>
{ongoingEvents.map((event) => (
  <View key={event.id} style={styles.eventCard}>
    {event.status === "OPEN" && (
      <Text style={styles.badge}>Featured</Text>
    )}

    <Text style={styles.eventTitle}>{event.title}</Text>
    <Text style={styles.eventInfo}>📅 {event.date}</Text>

    {event.time && (
      <Text style={styles.eventInfo}>⏰ {event.time}</Text>
    )}

    {event.location && (
      <Text style={styles.eventInfo}>📍 {event.location}</Text>
    )}

    <Text style={styles.eventInfo}>👥 {event.participants}</Text>

    {/* STATUS + ACTION */}
    {event.status === "ENDED" ? (
      <>
        <Text style={styles.statusEnded}>ENDED</Text>
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
      </>
    ) : (
      <>
      <Text style={styles.statusOpen}>OPEN</Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          router.push({
            pathname: "/register",
            params: event,
          })
        }
      >
        <Text style={styles.primaryButtonText}>Register</Text>
      </TouchableOpacity> </>
    )}
  </View>
))}


</View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Upcoming Events</Text>
  <TouchableOpacity onPress={() => router.push("/events")}>
    <Text style={styles.viewAll}>View All →</Text>
  </TouchableOpacity>
</View>



        <View style={styles.smallCard}>
          <View>
            <Text style={styles.eventTitle}>{upcomingEvent.title}</Text>
            <Text style={styles.eventInfo}>📅 {upcomingEvent.date}</Text>
            <Text style={styles.eventInfo}>📍 {upcomingEvent.location}</Text>
            <Text style={styles.eventInfo}>👥 {upcomingEvent.participants}</Text>
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              router.push({
                pathname: "/events/register",
                params: upcomingEvent,
              })
            }
          >
            <Text style={styles.secondaryButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Join KUCC */} 
      <TouchableOpacity style={styles.joinCard} 
      onPress={() => router.push("/membership")} 
      > 
      <Text style={styles.joinText}>Want to see more? Join KUCC</Text> 
      <Text style={styles.joinSubText}> Click here to become a member! </Text> 
      </TouchableOpacity>
    </ScrollView>
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
  /* Join KUCC */ joinCard: { backgroundColor: "#3C3F8F", marginHorizontal: 20, marginVertical: 30, borderRadius: 20, padding: 20, alignItems: "center", }, joinText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700", }, joinSubText: { color: "#FFFFFF", fontSize: 13, marginTop: 5, textDecorationLine: "underline", },
});
