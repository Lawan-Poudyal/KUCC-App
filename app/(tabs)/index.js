import { useRouter } from "expo-router";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";



const { width } = Dimensions.get("window");

export default function Homepage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
          <TouchableOpacity onPress={() => navigation.navigate("OngoingEvents")}>
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventCard}>
          <Text style={styles.badge}>Featured</Text>
          <Text style={styles.eventTitle}>Annual Tech Fest 2025</Text>
          <Text style={styles.eventInfo}>📅 December 15–17, 2025</Text>
          <Text style={styles.eventInfo}>⏰ 9:00 AM – 6:00 PM</Text>
          <Text style={styles.eventInfo}>📍 Main Auditorium, KU Campus</Text>
          <Text style={styles.eventInfo}>👥 250+ participants expected</Text>

          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate("UpcomingEvents")}>
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        {/* Event 1 */}
        <View style={styles.smallCard}>
          <View>
            <Text style={styles.eventTitle}>Web Development MasterClass</Text>
            <Text style={styles.eventInfo}>📅 Oct 5, 2025</Text>
            <Text style={styles.eventInfo}>👥 200 participants</Text>
          </View>

          <View style={styles.rightAlign}>
            <Text style={styles.statusEnded}>ENDED</Text>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>View Certificate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Event 2 */}
        <View style={styles.smallCard}>
          <View>
            <Text style={styles.eventTitle}>Open Source Contribution</Text>
            <Text style={styles.eventInfo}>📅 Dec 5, 2025 · 2:00 PM</Text>
            <Text style={styles.eventInfo}>📍 Conference Hall</Text>
            <Text style={styles.eventInfo}>👥 30 seats left</Text>
          </View>

          <View style={styles.rightAlign}>
            <Text style={styles.statusOpen}>OPEN</Text>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Join KUCC */}
      <TouchableOpacity
  style={styles.joinCard}
  onPress={() => router.push("/membership")}
>

        <Text style={styles.joinText}>Want to see more? Join KUCC</Text>
        
        <Text style={styles.joinSubText}>
          Click here to become a member!
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6E6",
  },

  /* Header */
  header: {
    backgroundColor: "#2f346e",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  subGreeting: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 15,
  },
  search: {
    backgroundColor: "#F7EDED",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 14,
  },

  /* Section */
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E2E2E",
  },
  viewAll: {
    fontSize: 13,
    color: "#4F5BD5",
    fontWeight: "600",
  },

  /* Event Cards */
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    elevation: 3,
  },
  smallCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },

  badge: {
    backgroundColor: "#3C3F8F",
    color: "#FFFFFF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 8,
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

  /* Buttons */
  primaryButton: {
    backgroundColor: "#3C3F8F",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 15,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  secondaryButton: {
    backgroundColor: "#3C3F8F",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  rightAlign: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  /* Status Tags */
  statusOpen: {
    backgroundColor: "#3C3F8F",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 8,
  },
  statusEnded: {
    backgroundColor: "#B0B0B0",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 8,
  },

  /* Join KUCC */
  joinCard: {
    backgroundColor: "#3C3F8F",
    marginHorizontal: 20,
    marginVertical: 30,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  joinText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  joinSubText: {
    color: "#FFFFFF",
    fontSize: 13,
    marginTop: 5,
    textDecorationLine: "underline",
  },
});
