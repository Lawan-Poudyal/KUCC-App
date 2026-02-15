import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse profile passed from ProfileScreen
  const initialProfile = params.profile
    ? JSON.parse(params.profile)
    : {
        name: "",
        email: "",
        phone: "",
        program: "",
        semester: "",
        batch: "",
        regNumber: "",
        role: "",
        receipt: null,
        image: null,
      };

  const [profile, setProfile] = useState(initialProfile);
  const [receiptName, setReceiptName] = useState(initialProfile.receipt || null);
  const [profileImage, setProfileImage] = useState(initialProfile.image || null);

  // Pick profile image
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
      setProfileImage(result.assets[0].uri);
      setProfile(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  // Pick receipt PDF
  const pickReceipt = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (result.type === "success") {
      setReceiptName(result.name);
      setProfile(prev => ({ ...prev, receipt: result.name }));
    }
  };

  // Save changes
  const saveProfile = () => {
    router.push({
      pathname: "/profile",
      params: { updatedProfile: JSON.stringify(profile) },
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back button */}
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 6 }}>Back</Text>
      </Pressable>

      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.card}>
        {/* Profile Image */}
        <Pressable onPress={pickImage} style={styles.avatarWrapper}>
          <Image
            source={profileImage ? { uri: profileImage } : require("../assets/kucc-logo.png")}
            style={styles.avatar}
          />
          <Text style={{ color: "#2f346e", textAlign: "center", marginTop: 6 }}>Change Photo</Text>
        </Pressable>

        {/* Text inputs */}
        {["name","email","phone","program","semester","batch","regNumber","role"].map(field => (
          <View key={field} style={{ marginBottom: 12 }}>
            <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
            <TextInput
              style={styles.input}
              value={profile[field]}
              onChangeText={text => setProfile(prev => ({ ...prev, [field]: text }))}
            />
          </View>
        ))}

        {/* Receipt */}
        <Text style={styles.label}>Receipt PDF</Text>
        <TouchableOpacity style={styles.receiptBtn} onPress={pickReceipt}>
          <Text style={styles.receiptText}>{receiptName || "Attach PDF"}</Text>
        </TouchableOpacity>
      </View>

      {/* Save button */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  backBtn: { flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: -10, backgroundColor: "#2f346e", padding: 8, borderRadius: 10, alignSelf: "flex-start" },
  title: { fontSize: 22, fontWeight: "700", color: "#2f346e", marginBottom: 20, textAlign: "center" },
  card: { backgroundColor: "#f5f5f5", borderRadius: 12, padding: 15, marginBottom: 20 },
  label: { fontWeight: "600", marginBottom: 6, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, fontSize: 14, backgroundColor: "#fff" },
  receiptBtn: { backgroundColor: "#2f346e", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 5 },
  receiptText: { color: "#fff", fontWeight: "600" },
  saveBtn: { backgroundColor: "#2f346e", padding: 15, borderRadius: 12, alignItems: "center", marginBottom: 80 },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  avatarWrapper: { alignItems: "center", marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: "#2f346e", backgroundColor: "#ddd" },
});
