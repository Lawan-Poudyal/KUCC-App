import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, LayoutAnimation, Platform, UIManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const defaultImage = require("../../assets/kucc-logo.png");
// Executive images
const sakshiImg = require("../../assets/sakshi.png");
const kiranImg = require("../../assets/kiran.png");
const sakshamImg = require("../../assets/saksham.png");
const innimaImg = require("../../assets/innima.png");
const lawanImg = require("../../assets/lawan.png");
const shriharshImg = require("../../assets/shriharsh.png");

// Community images
const docuImg = require("../../assets/docu.png");
const mlImg = require("../../assets/ml.png");
const webdevImg = require("../../assets/webdev.png");
const designImg = require("../../assets/design.png");
const cloudImg = require("../../assets/cloud.png");
const mobappImg = require("../../assets/mobapp.png");
const cyberImg = require("../../assets/cybersec.png");


export default function About() {
  const [expandedPresident, setExpandedPresident] = useState(false);
  const [expandedCommunity, setExpandedCommunity] = useState(null);

  const presidentMessage =
    "KUCC is more than just a club, it's a space to try new things, work together, and support each other along the way. It's about learning from one another, celebrating small wins, and turning curiosity into action. Every effort counts, and every contribution makes a difference. This year, I hope to make KUCC even more welcoming and vibrant. Let's keep inspiring each other, building meaningful projects, and creating a community where ideas don't just stay on paper.\n\n - Sakshi KC, President 25/26";

  const executives = [
  { name: "Sakshi KC", role: "President", image: sakshiImg },
  { name: "Kiran Dahal", role: "Vice President", image: kiranImg },
  { name: "Saksham Gyawali", role: "General Secretary", image: sakshamImg },
  { name: "Innima Karki", role: "Treasurer", image: innimaImg },
  { name: "Lawan Poudyal", role: "Club Secretary", image: lawanImg },
  { name: "Shriharsh Sharma Acharya", role: "KUOSC Coordinator", image: shriharshImg },
];


  const communities = [
  {
    name: "Documentation Community",
    description:
      "Enhance your documentation skills through workshops, research paper writing, and collaborative projects to streamline processes and impact.",
    image: docuImg,
  },
  {
    name: "Machine Learning Community",
    description:
      "Advance your skills in machine learning and data science with dynamic workshops, collaborative projects, and career opportunities.",
    image: mlImg,
  },
  {
    name: "Web Development Community",
    description:
      "Master modern web technologies through hands-on workshops, collaborative projects, and mentorship.",
    image: webdevImg,
  },
  {
    name: "Design Community",
    description:
      "Explore creative design through workshops, hands-on activities, and networking with design professionals. All skill levels welcome!",
    image: designImg,
  },
  {
    name: "Cloud Community",
    description:
      "Dive into cloud computing with AWS, Azure, and GCP. Learn infrastructure, deployment, and cloud-native technologies through practical workshops.",
    image: cloudImg,
  },
  {
    name: "Mobile App Development Community",
    description:
      "Build cross-platform mobile applications with Flutter, React Native, and native technologies. Engage in workshops and collaborative projects.",
    image: mobappImg,
  },
  {
    name: "Cybersecurity & Networking Community",
    description:
      "Gain practical insights into networking and cybersecurity through workshops and interactive sessions. Ideal for all skill levels.",
    image: cyberImg,
  },
];


  const toggleCommunity = (i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCommunity(expandedCommunity === i ? null : i);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Title */}
      <Text style={styles.title}>Kathmandu University Computer Club</Text>
      <Text style={styles.description}>
        Since 1997, KUCC has pioneered technological innovation and excellence at Kathmandu University. Over 1000 members engaged through technology, research, and innovation.
      </Text>

      {/* President */}
      <TouchableOpacity
        style={styles.presidentCard}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpandedPresident(!expandedPresident);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={sakshiImg} style={styles.presidentImage} />
          <Text style={styles.presidentName}>Sakshi KC</Text>
          <Ionicons
            name={expandedPresident ? "chevron-up" : "chevron-down"}
            size={24}
            color="#3C3F8F"
            style={{ marginLeft: "auto" }}
          />
        </View>
        {expandedPresident && <Text style={styles.presidentMessage}>{presidentMessage}</Text>}
      </TouchableOpacity>

      {/* Executives */}
      <Text style={styles.subTitle}>Meet Our Team</Text>
      <View style={styles.execContainer}>
        {executives.map((exec, i) => (
          <View key={i} style={styles.execCard}>
            <Image source={exec.image || defaultImage} style={styles.execImage} />
            <Text style={styles.execName}>{exec.name}</Text>
            <Text style={styles.execRole}>{exec.role}</Text>
          </View>
        ))}
      </View>

      {/* Communities */}
      <Text style={styles.subTitle}>Explore Communities</Text>
      {communities.map((com, i) => (
        <View key={i} style={styles.communityCard}>
          <TouchableOpacity style={styles.communityHeader} onPress={() => toggleCommunity(i)}>
            <Image source={com.image} style={styles.communityImage} />
            <Text style={styles.communityName}>{com.name}</Text>
            <Ionicons
              name={expandedCommunity === i ? "chevron-up" : "chevron-down"}
              size={22}
              color="#3C3F8F"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
          <Collapsible collapsed={expandedCommunity !== i}>
            <Text style={styles.communityDescription}>{com.description}</Text>
          </Collapsible>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7", padding: 20 },
  title: { fontSize: 24, fontWeight: "800", marginTop: 30, marginBottom: 10, textAlign: "center", color: "#3C3F8F" },
  description: { fontSize: 14, color: "#555", marginBottom: 20, textAlign: "center" },
  subTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#3C3F8F" },

  presidentCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  presidentImage: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  presidentName: { fontWeight: "700", fontSize: 16, color: "#3C3F8F" },
  presidentMessage: { marginTop: 10, fontSize: 14, color: "#555" },

  execContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  execCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  execImage: { width: 70, height: 70, borderRadius: 35, marginBottom: 8 },
  execName: { fontWeight: "700", color: "#333", fontSize: 14, textAlign:'center' },
  execRole: { fontSize: 12, color: "#555" },

  communityCard: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 15, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  communityHeader: { flexDirection: "row", alignItems: "center", padding: 12 },
  communityImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  communityName: { fontSize: 16, fontWeight: "700", color: "#3C3F8F", flexShrink: 1 },
  communityDescription: { paddingHorizontal: 12, paddingBottom: 12, fontSize: 14, color: "#555" },
});
