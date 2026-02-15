// frontend/app/edit.js
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { getProfileApi, updateProfileApi } from "../services/profileApi";

export default function EditProfile() {
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.unsafeMetadata?.name || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: user?.unsafeMetadata?.phone || "",
    program: "",
    semester: "",
    batch: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await getToken();
      const data = await getProfileApi(token);

      setProfile({
        name: data.name || user?.unsafeMetadata?.name || "",
        email: data.email || user?.primaryEmailAddress?.emailAddress || "",
        phone: data.phone || user?.unsafeMetadata?.phone || "",
        program: data.program || "",
        semester: data.semester || "",
        batch: data.batch || "",
      });

      if (data.imageUrl) {
        setProfileImage(data.imageUrl);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to access gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0]); // IMPORTANT (full object)
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const payload = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        program: profile.program,
        semester: profile.semester,
        batch: profile.batch,
      };

      await updateProfileApi(
        token,
        payload,
        profileImage?.uri ? profileImage : null,
      );

      Alert.alert("Success", "Profile updated successfully");

      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper backgroundColor="#2F346E" statusBarStyle="light">
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          {/* Profile Image */}
          <Pressable onPress={pickImage} style={styles.avatarWrapper}>
            <Image
              source={
                profileImage
                  ? {
                      uri: profileImage.uri ? profileImage.uri : profileImage,
                    }
                  : require("../assets/kucc-logo.png")
              }
              style={styles.avatar}
            />
            <Text
              style={{ color: "#2f346e", textAlign: "center", marginTop: 6 }}
            >
              Change Photo
            </Text>
          </Pressable>

          {/* Inputs */}
          {["name", "email", "phone", "program", "semester", "batch"].map(
            (field) => (
              <View key={field} style={{ marginBottom: 12 }}>
                <Text style={styles.label}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Text>
                <TextInput
                  style={styles.input}
                  value={profile[field]}
                  onChangeText={(text) =>
                    setProfile((prev) => ({ ...prev, [field]: text }))
                  }
                />
              </View>
            ),
          )}
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={saveProfile}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: -10,
    backgroundColor: "#2f346e",
    padding: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2f346e",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  label: { fontWeight: "600", marginBottom: 6, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  receiptBtn: {
    backgroundColor: "#2f346e",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  receiptText: { color: "#fff", fontWeight: "600" },
  saveBtn: {
    backgroundColor: "#2f346e",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 80,
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  avatarWrapper: { alignItems: "center", marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#2f346e",
    backgroundColor: "#ddd",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
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
});
