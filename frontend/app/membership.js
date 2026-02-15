// frontend/app/membership.js

import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import {
  becomeMemberApi,
  checkMembershipStatusApi,
} from "../services/membershipApi";
import { getProfileApi, updateProfileApi } from "../services/profileApi";

export default function Membership() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await getToken();
        const data = await getProfileApi(token);

        if (!data.is_profile_complete) {
          Alert.alert(
            "Complete your Profile",
            "Please complete your profile first.",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => {
                  router.back(); // go back
                },
              },
              {
                text: "Okay",
                onPress: () => {
                  router.replace("/edit");
                },
              },
            ],
          );
        }

        setProfile(data);
      } catch (err) {
        console.log("PROFILE ERROR:", err.message);

        if (err.message === "Profile not found") {
          Alert.alert(
            "Complete your Profile",
            "Please complete your profile first.",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => {
                  router.back(); // go back
                },
              },
              {
                text: "Okay",
                onPress: () => {
                  router.replace("/edit");
                },
              },
            ],
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleRegistration = async () => {
    try {
      const token = await getToken();

      const data = await becomeMemberApi(token);

      Alert.alert("Success", data.message);

      // optional refresh profile
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const checkMembershipStatus = async () => {
    try {
      const token = await getToken();
      const data = await checkMembershipStatusApi(token);

      if (data.status === "approved") {
        try {
          const updatedProfile = { ...profile, is_member: true };
          setProfile(updatedProfile); // update local state

          // console.log("profile: ", updatedProfile);
          const data = updateProfileApi(token, updatedProfile);
          console.log("Profile also Updated!");
        } catch (error) {
          console.log("Error: ", error.message);
        }
        Alert.alert("Approved", `🎉 You're a Member of KUCC!`, [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              router.back(); // go back
            },
          },
          {
            text: "View KUCC ID",
            onPress: () => {
              router.replace("/edit");
            },
          },
        ]);
      } else if (data.status === "pending") {
        Alert.alert("Status", data.message);
      } else {
        Alert.alert("Status", data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  if (loading) return null;

  return (
    <ScreenWrapper backgroundColor="#2F346E" statusBarStyle="light">
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          Join Kathmandu University Computer Club
        </Text>

        <Text style={styles.sectionTitle}>Why Join KUCC?</Text>

        <View style={styles.benefitBox}>
          <Text style={styles.benefit}>
            🚀 Access to tech workshops & bootcamps
          </Text>
          <Text style={styles.benefit}>
            💡 Participate in hackathons & competitions
          </Text>
          <Text style={styles.benefit}>🤝 Network with tech enthusiasts</Text>
          <Text style={styles.benefit}>
            🎓 Industry mentorship & career guidance
          </Text>
          <Text style={styles.benefit}>🏆 Priority access to club events</Text>
          <Text style={styles.benefit}>📜 Official KUCC Membership ID</Text>
        </View>

        <View style={styles.feeBox}>
          <Text style={styles.feeText}>Membership Fee (One time Fee)</Text>
          <Text style={styles.amount}>NRs. 1 </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegistration}>
          <Text style={styles.buttonText}>Join Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={checkMembershipStatus}>
          <Text style={styles.buttonText}>Check Membership Status</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6E6",
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  benefitBox: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
  },
  benefit: {
    marginBottom: 10,
  },
  feeBox: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  feeText: {
    fontWeight: "600",
  },
  amount: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#3C3F8F",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
