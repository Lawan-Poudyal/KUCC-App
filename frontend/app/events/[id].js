// frontend/app/events/[id].js
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { fetchEventById, registerForEvent } from "../../services/eventsApi";

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  const [registering, setRegistering] = useState(false);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadEvent();
  }, [id]);

  // const handleFreeRegistration = async () => {
  //   Alert.alert("Confirm Registration", "Do you want to register?", [
  //     { text: "Cancel", style: "cancel" },
  //     {
  //       text: "Yes",
  //       onPress: async () => {
  //         try {
  //           const token = await getToken();
  //           await registerForEvent(event.id, null, token);
  //           Alert.alert("Success", "Registered successfully!");
  //         } catch (err) {
  //           Alert.alert("Opps!", err.message);
  //         }
  //       },
  //     },
  //   ]);
  // };

  // const handlePaidRegistration = async (method) => {
  //   try {
  //     const token = await getToken();
  //     await registerForEvent(event.id, method, token);
  //     Alert.alert("Success", "Registered successfully!");
  //   } catch (err) {
  //     Alert.alert("Opps!", err.message);
  //   }
  // };

  const handleRegistration = async () => {
    Alert.alert("Confirm Registration", "Do you want to register?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            setRegistering(true); // show registering state
            const token = await getToken();

            await registerForEvent(event.id, "Cash", token);

            setRegistering(false); // done registering
            Alert.alert("Success", "🎉 Registered successfully!");
          } catch (err) {
            setRegistering(false);
            Alert.alert("Oops!", err.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!event) {
    return <Text style={{ textAlign: "center" }}>Event not found.</Text>;
  }

  return (
    <ScreenWrapper backgroundColor="#2F346E" statusBarStyle="light">
      <View style={{ flex: 1, backgroundColor: "#F2F2F2" }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}> {event.title} </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{event.description}</Text>

            <Text style={styles.meta}>
              📅 {event.event_date} • ⏰ {event.event_time}
            </Text>

            <Text style={styles.meta}>📍 {event.location}</Text>

            <Text style={styles.meta}>💰 {event.payment_amount}</Text>

            {event.banner_url && (
              <View style={styles.bannerContainer}>
                <Image
                  source={{ uri: event.banner_url }}
                  style={styles.bannerImage}
                  resizeMode="contain" // ensures entire image is visible
                />
              </View>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={handleRegistration}
              disabled={registering || event.status === "completed"}
            >
              <Text style={styles.buttonText}>
                {registering
                  ? "Registering..."
                  : event.status === "completed"
                    ? "Registration Closed"
                    : "Register"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
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

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  banner: {
    width: "100%",
    height: 220,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#3C3F8F",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },

  bannerContainer: {
    width: "100%",
    height: 250, // adjust depending on your preferred height
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  bannerImage: {
    width: "100%",
    height: "100%",
  },
});
