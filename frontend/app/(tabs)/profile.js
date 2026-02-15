// frontend/app/(tabs)/profile.js
import { useAuth, useClerk, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProfileOption from "../../components/ProfileOption";
import ScreenWrapper from "../../components/ScreenWrapper";
import { getProfileApi } from "../../services/profileApi";
export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    semester: "",
    batch: "",
    isProfileComplete: false,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchProfile(); // re-fetch profile data
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await getToken();
      const data = await getProfileApi(token);

      if (!data.is_profile_complete) {
        // Redirect to Edit Profile if profile incomplete
        router.replace("/edit");
        return;
      }
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        program: data.program || "",
        semester: data.semester || "",
        batch: data.batch || "",
        isProfileComplete: data.is_profile_complete || false,
      });

      if (data.imageUrl) {
        setProfileImage(data.imageUrl);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(profileImage);
  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)");
          } catch (err) {
            console.error("Sign out error:", err);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const options = [
    { title: "Edit Profile", icon: "create-outline", route: "/edit" },
    {
      title: "Join KUCC",
      icon: "document-text-outline",
      route: "/membership",
    },
    { title: "View KUCC ID Card", icon: "card-outline", route: "/id-card" },

    { title: "Achievements", icon: "trophy-outline", route: "/achievements" },
    { title: "Sign Out", icon: "log-out-outline" },
  ];

  // console.log(profileImage);

  return (
    <>
      <ScreenWrapper backgroundColor="#2F346E" statusBarStyle="light">
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
              ) : (
                <Ionicons name="person" size={40} color="#fff" />
              )}
            </View>
            <Text style={styles.name}>
              {profile.name || user?.unsafeMetadata?.name || "User"}
            </Text>
            <Text style={styles.email}>
              {user?.primaryEmailAddress?.emailAddress}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color="#5B5F8D" />
                <Text style={styles.infoLabel}>Sec. Email</Text>
                <Text style={styles.infoValue}>
                  {profile.email || user?.primaryEmailAddress?.emailAddress}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#5B5F8D" />
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>
                  {profile.phone ||
                    user?.unsafeMetadata?.phone ||
                    "Not provided"}
                </Text>
              </View>
              {profile.program && profile.batch && profile.semester ? (
                <>
                  <View style={styles.infoRow}>
                    <Ionicons name="book-outline" size={20} color="#5B5F8D" />
                    <Text style={styles.infoLabel}>Program</Text>
                    <Text style={styles.infoValue}>{profile.program}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="people-outline" size={20} color="#5B5F8D" />
                    <Text style={styles.infoLabel}>Batch</Text>
                    <Text style={styles.infoValue}>{profile.batch}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#5B5F8D"
                    />
                    <Text style={styles.infoLabel}>Semester</Text>
                    <Text style={styles.infoValue}>{profile.semester}</Text>
                  </View>
                </>
              ) : null}
            </View>

            <View style={styles.optionsContainer}>
              {options.map((item, index) => (
                <ProfileOption
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  isDropdown={item.dropdown}
                  onPress={() => {
                    if (item.route) {
                      router.push(item.route);
                    } else {
                      handleSignOut();
                    }
                  }}
                />
              ))}
            </View>

            {/* <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity> */}
          </ScrollView>
        </View>
      </ScreenWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 20,
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#2F346E",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#383F78",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#E0E0E0",
  },
  infoSection: {
    padding: 20,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DADAEA",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 15,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#383F78",
    fontWeight: "500",
    flex: 2,
  },
  signOutButton: {
    flexDirection: "row",
    backgroundColor: "#E64B4B",
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});
