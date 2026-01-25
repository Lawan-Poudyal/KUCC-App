import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { generateCertificate } from "../components/generateCertificate";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useLocalSearchParams } from "expo-router";

export default function Certificates() {
  const router = useRouter();

  const params = useLocalSearchParams();
console.log(params.title);
  const certificates = [
    { name: "John Doe", event: "Web Development Masterclass" },
    { name: "John Doe", event: "Hackathon 2024" },
    { name: "John Doe", event: "IT MEET 2025" },
    { name: "John Doe", event: "KU Hackfest 2024" },
  ];

  const handleDownload = async (c) => {
    const uri = await generateCertificate(c.name, c.event);
    await Sharing.shareAsync(uri);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Certificates</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Certificates */}
      {certificates.map((c, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.event}>{c.event}</Text>
          <Text style={styles.name}>{c.name}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDownload(c)}
          >
            <Text style={styles.buttonText}>Download Certificate</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
  },

  content: {
    alignItems: "center",
    paddingBottom: 30,
  },

  header: {
    width: "100%",
    backgroundColor: "#2F346E",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  backArrow: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
  },

  card: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginVertical: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  event: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2F346E",
    marginBottom: 4,
  },

  name: {
    fontSize: 14,
    color: "#555",
    marginBottom: 14,
  },

  button: {
    backgroundColor: "#3C3F8F",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
