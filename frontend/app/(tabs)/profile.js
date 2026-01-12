import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";


const { width } = Dimensions.get('window');

export default function ProfileScreen() {

  const [profileImage, setProfileImage] = useState(null);

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
  }
};

  return (
    <ScrollView style={styles.container}>
      <Pressable style={styles.editProfileBtn} onPress={() => console.log("Edit profile")}>
  <Ionicons name="pencil-outline" size={20} color="#fff" />
</Pressable>

      {/* Top Wave Shape */}
      <Svg height="150" viewBox="0 0 1440 380">

        <Path
  fill="#2f346e"
  d="
    M0,360
    C1900,20 40,180 70,1800
    C900,440 900,180 1440,209
    L1440,0
    L0,0
    Z
  "
/>

      </Svg>

      {/* User Info */}
      <View style={styles.userInfo}>
        
        <Pressable onPress={pickImage} style={styles.avatarWrapper}>
  <Image
    source={
      profileImage
        ? { uri: profileImage }
        : require("../../assets/kucclogo.png") // fallback image
    }
    style={styles.avatar}
  />
</Pressable>

        <Text style={styles.name}>Janet Smith</Text>
        <Text style={styles.email}>janetsmith@gmail.com</Text>
        <Text style={styles.phone}>+977 9800202020</Text>
      </View>

      {/* Info Cards */}
      <View style={styles.row}>
        <View style={styles.card}>
    <Text style={styles.rowItem}>Program</Text>
    <Text style={styles.rowItem}>Semester</Text>
    <Text style={styles.rowItem}>Batch</Text>
    <Text style={styles.rowItem}>Registration Number</Text>
    <Text style={styles.rowItem}>Role</Text>
  </View>

  {/* VALUE CARD */}
  <View style={styles.card}>
    <Text style={[styles.rowItem, styles.value]}>CS</Text>
    <Text style={[styles.rowItem, styles.value]}>4th</Text>
    <Text style={[styles.rowItem, styles.value]}>2022</Text>
    <Text style={[styles.rowItem, styles.value]}>02345677</Text>
    <Text style={[styles.rowItem, styles.value]}>Executive Member</Text>
  </View>
      </View>

      {/* Member Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Member Since: 2022-09-03</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <Text style={styles.infoText}>
          Membership Payment Receipt: <Pressable onPress={() => console.log("Opening receipt...")}>
            <Text style={styles.link}>receipt.pdf</Text>
        </Pressable></Text></View>
      </View>

      {/* Events */}
      <View style={styles.eventsBox}>
        <Text style={{ color: "white", fontSize: 16, marginBottom: 5 }}>
          Events Participated:
        </Text>
        <Text style={styles.eventItem}>1. IT Meet (Logistics)</Text>
        <Text style={styles.eventItem}>2. NCCI (Volunteer)</Text>
        <Text style={styles.eventItem}>3. PowerBI Workshop (Organizer)</Text>

        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>View your Certificates</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Space */}
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    position: 'relative'
  },
  userInfo: {
    alignItems: "center",
    marginTop: -20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2f346e",
  },
  email: {
    marginTop: 4,
    color: "#444",
  },
  phone: {
    color: "#444",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },

  card: {
    backgroundColor: "#2f346e",
    padding: 15,
    width: "42%",
    borderRadius: 12,
  },
  label: {
    color: "#ccc",
    marginTop: 8,
  },
  value: {
    color: "white",
    fontSize: 15,
    marginBottom: 6,
  },

  infoBox: {
    backgroundColor: "#2f346e",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  link: {
    color: "#c7d7ff",
    textDecorationLine: "underline",
  },

  eventsBox: {
    backgroundColor: "#2f346e",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  eventItem: {
    color: "white",
    marginBottom: 4,
  },
  btn: {
    marginTop: 15,
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnText: {
    color: "#2f346e",
    fontWeight: "bold",
  },
  avatarWrapper: {
  marginBottom: 10,
},
avatar: {
  width: 100,
  height: 100,
  borderRadius: 50, // makes it circular
  borderWidth: 3,
  borderColor: "#2f346e",
  backgroundColor: "#ddd",
},
rowItem: {
  height: 36,          
  fontSize: 14,
  fontWeight:'bold',
  color: "#fefefeff",
  marginBottom: 8,
},

value: {
  color: "white",
  textAlign: "left",
  fontWeight: "600",
},
avatarContainer: {
  position: "relative",
  marginBottom: 10,
},
editProfileBtn: {
  position: "absolute",
  top: 50,          // adjust for status bar
  left: 20,
  zIndex: 50,

  flexDirection: "row",
  alignItems: "center",
  gap: 6,

  backgroundColor: "rgba(0,0,0,0.35)", // looks premium over waves
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
},

});
