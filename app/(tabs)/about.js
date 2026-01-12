import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Dimensions, Image, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from "react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const defaultImage = require("../../assets/kucclogo.png");
const { width } = Dimensions.get("window");

export default function About() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  const executives = [
    { name: "Sakshi KC", role: "President" },
    { name: "Rohan Sharma", role: "Vice President" },
    { name: "Anita Rai", role: "Secretary" },
    { name: "Deepak Lama", role: "Treasurer" },
  ];

  const presidentMessage = `
KUCC is more than just a club, it's a space to try new things, work together, and support each other along the way.
It's about learning from one another, celebrating small wins, and turning curiosity into action. Every effort counts, and every contribution makes a difference.
This year, I hope to make KUCC even more welcoming and vibrant. Let's keep inspiring each other, building meaningful projects, and creating a community where ideas don't just stay on paper.

- Sakshi KC, President 25/26
  `;

  const communities = [
    {
      name: "Documentation Community",
      description:
        "Enhance your documentation skills through workshops, research paper writing, and collaborative projects to streamline processes and impact.",
      coordinators: [
        { name: "Alice Sharma", role: "Head" },
        { name: "Bob KC", role: "Coordinator" },
      ],
      image: defaultImage,
    },
    {
      name: "Machine Learning Community",
      description:
        "Advance your skills in machine learning and data science with dynamic workshops, collaborative projects, and career opportunities.",
      coordinators: [
        { name: "Chandra Rai", role: "Head" },
        { name: "Deepa Lama", role: "Coordinator" },
      ],
      image: defaultImage,
    },
    {
      name: "Web Development Community",
      description:
        "Master modern web technologies through hands-on workshops, collaborative projects, and mentorship.",
      coordinators: [
        { name: "Esha Koirala", role: "Head" },
        { name: "Floyd Gurung", role: "Coordinator" },
      ],
      image: defaultImage,
    },
    {
      name: "Design Community",
      description:
        "Explore creative design through workshops, hands-on activities, and networking with design professionals. All skill levels welcome!",
      coordinators: [
        { name: "Alice Sharma", role: "Head" },
        { name: "Bob KC", role: "Coordinator" },
      ],
      image: defaultImage,
      },
    {
      name: "Cloud Community",
      description:
        "Dive into cloud computing with AWS, Azure, and GCP. Learn infrastructure, deployment, and cloud-native technologies through practical workshops.",
    coordinators: [
        { name: "Alice Sharma", role: "Head" },
        { name: "Bob KC", role: "Coordinator" },
      ],
      image: defaultImage,},
    {
      name: "Mobile App Development Community",
      description:
        "Build cross-platform mobile applications with Flutter, React Native, and native technologies. Engage in workshops and collaborative projects.",
    coordinators: [
        { name: "Alice Sharma", role: "Head" },
        { name: "Bob KC", role: "Coordinator" },
      ],
      image: defaultImage,},
    {
      name: "Cybersecurity & Networking Community",
      description:
        "Gain practical insights into networking and cybersecurity through workshops and interactive sessions. Ideal for all skill levels.",
    coordinators: [
        { name: "Alice Sharma", role: "Head" },
        { name: "Bob KC", role: "Coordinator" },
      ],
      image: defaultImage,},
  ];


  return (
    <ScrollView style={styles.container}
    contentContainerStyle={{ flexGrow: 1, paddingBottom: 40}}>
      {/* KUCC Intro */}
      <Text style={styles.title}>Kathmandu University Computer Club</Text>
      <Text style={styles.descriptionFirst}>
        Since 1997, KUCC has pioneered technological innovation and excellence at Kathmandu University for over two decades. 
        Engaging over 1000 members through technology, research, and innovation.
      </Text>

      {/* President Message */}
      <LinearGradient colors={['#2c2c3e', '#3c3f8f']} style={styles.presidentCard}>
        <Text style={styles.presidentTitle}>Message from Our President</Text>
        <Text style={styles.presidentMessage}>{presidentMessage}</Text>
      </LinearGradient>

      {/* Meet Our Team */}
      <Text style={styles.subTitle}>Meet Our Team</Text>
      <View style={styles.executivesContainer}>
        {executives.map((exec, i) => (
          <LinearGradient key={i} colors={['#2c2c3e', '#3c3f8f']} style={styles.execCard}>
            <Image source={defaultImage} style={styles.execImage} />
            <Text style={styles.execName}>{exec.name}</Text>
            <Text style={styles.execRole}>{exec.role}</Text>
          </LinearGradient>
        ))}
      </View>

      {/* Explore Communities */}
      <Text style={styles.subTitle}>Explore Communities</Text>
      {communities.map((com, i) => (
        <LinearGradient key={i} colors={['#2c2c3e', '#3c3f8f']} style={styles.card}>
          <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpand(i)}>
            <Image source={com.image} style={styles.communityImage} />
            <Text style={styles.communityName}>{com.name}</Text>
            <Ionicons
              name={expandedIndex === i ? "chevron-up" : "chevron-down"}
              size={22}
              color="#ffffffff"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

          {expandedIndex === i && (
            <View style={styles.cardContent}>
              <Text style={styles.description}>{com.description}</Text>
              <Text style={styles.coordinatorTitle}>Coordinators:</Text>
              {com.coordinators.map((coord, idx) => (
                <View key={idx} style={styles.coordinator}>
                  <Image source={defaultImage} style={styles.coordImage} />
                  <View>
                    <Text style={styles.coordName}>{coord.name}</Text>
                    <Text style={styles.coordRole}>{coord.role}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </LinearGradient>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff", padding: 20, paddingTop: 30},
  title: { fontSize: 24, fontWeight: "800", marginBottom: 10, color: "#000000ff", textAlign: "center" },
  description: { fontSize: 14, color: "#ffffffff", marginBottom: 12 },
  descriptionFirst: { fontSize: 14, color: "#000000ff", marginBottom: 12 },
  subTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#ffffffff" },

  presidentCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  presidentTitle: { fontWeight: "700", fontSize: 16, color: "#FFF", marginBottom: 8 },
  presidentMessage: { color: "#EEE", fontSize: 14 },

  executivesContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  execCard: { width: width / 2 - 25, borderRadius: 15, padding: 10, marginBottom: 15, alignItems: "center" },
  execImage: { width: 60, height: 60, borderRadius: 12, marginBottom: 6 },
  execName: { fontWeight: "700", color: "#FFF", fontSize: 14 },
  execRole: { fontSize: 12, color: "#DDD" },

  card: { borderRadius: 15, marginBottom: 15, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 12 },
  communityImage: { width: 50, height: 50, borderRadius: 10, marginRight: 12 },
  communityName: { fontSize: 16, fontWeight: "700", color: "#f7f7f7ff", flexShrink: 1 },
  cardContent: { paddingHorizontal: 12, paddingBottom: 12 },
  coordinatorTitle: { fontWeight: "700", marginTop: 10, marginBottom: 6, color: "#ffffffff" },
  coordinator: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  coordImage: { width: 40, height: 40, borderRadius: 8, marginRight: 10 },
  coordName: { fontWeight: "600", color: "#FFF" },
  coordRole: { fontSize: 12, color: "#DDD" },
});

    