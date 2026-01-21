import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
  const router = useRouter();
  const { source } = useLocalSearchParams();
  const { title, date, time, location, participants } =
    useLocalSearchParams();

  return (
    <ScrollView style={styles.firstcontainer}>
      <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
      <Text style={styles.registerevent}>Event Registration</Text>
      {/* Event Details Card */}
      <View style={styles.container}>
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{title}</Text>
        <Text style={styles.eventInfo}>📅 {date}</Text>
        {time && <Text style={styles.eventInfo}>⏰ {time}</Text>}
        <Text style={styles.eventInfo}>📍 {location}</Text>
        <Text style={styles.eventInfo}>👥 {participants}</Text>
      </View>

      {/* Registration Form */}
      <Text style={styles.formTitle}>Register for this event</Text>

      <TextInput placeholder="Full Name" style={styles.input} />
      <TextInput placeholder="Contact Number" style={styles.input} />
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6E6E6", padding: 20},
  firstcontainer: { flex: 1, backgroundColor: "#E6E6E6", marginTop:20,},
  registerevent: { fontSize: 26, fontWeight: "700", marginTop: 0, padding:20 },
    back: { marginTop: 40, alignItems: "left" },
  header: {
    backgroundColor: "#2F346E",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  eventCard: {
    backgroundColor: "#FFF",
    marginTop: -20,
    borderRadius: 20,
    padding: 16,
    marginBottom: 25,
    elevation: 3,
  },
  eventTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  eventInfo: { fontSize: 13, color: "#555", marginBottom: 4 },

  formTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },

  input: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 14,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#3C3F8F",
    borderRadius: 25,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#FFF", fontWeight: "700" },
});
