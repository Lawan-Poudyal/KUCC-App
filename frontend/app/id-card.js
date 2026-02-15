import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import ScreenWrapper from "../components/ScreenWrapper";
import { checkMembershipStatusApi } from "../services/membershipApi";
import { getProfileApi } from "../services/profileApi";

export default function IDCard() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [memberCode, setMemberCode] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();

        // Fetch profile
        const profileData = await getProfileApi(token);
        if (!profileData.is_profile_complete) {
          Alert.alert("Profile Incomplete", "Complete your profile first!");
          return;
        }
        setProfile(profileData);

        if (profileData.imageUrl) setProfileImage(profileData.imageUrl);

        // Fetch membership status
        const membershipData = await checkMembershipStatusApi(token);

        if (membershipData.status === "approved") {
          setMemberCode(membershipData.member_code);
        } else {
          Alert.alert("Membership Status", membershipData.message);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  if (!profile || !memberCode) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading Membership ID...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor="#2F346E" statusBarStyle="light">
      <View style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>KUCC ID card</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.clubName}>
              Kathmandu University Computer Club
            </Text>

            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {profile.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <Text style={styles.name}>{profile.name}</Text>

            <View style={styles.memberCodeBox}>
              <Text style={styles.memberCodeLabel}>Member Code</Text>
              <Text style={styles.memberCode}>{memberCode}</Text>
            </View>

            {/* <Text style={styles.clubName}>
              Kathmandu University Computer Club
            </Text> */}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#000", fontSize: 16 },
  card: {
    width: "100%",
    backgroundColor: "#3C3F8F",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: { fontSize: 36, fontWeight: "700", color: "#3C3F8F" },
  name: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 5 },
  email: { color: "#E0E0E0", fontSize: 14, marginBottom: 15 },
  memberCodeBox: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  memberCodeLabel: { fontSize: 12, color: "#555" },
  memberCode: { fontSize: 20, fontWeight: "700", color: "#3C3F8F" },
  clubName: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 15,
    textAlign: "center",
  },
});
