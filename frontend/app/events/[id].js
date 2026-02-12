// frontend/app/events/[id].js

import { useAuth, useUser } from "@clerk/clerk-expo";
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
import { fetchEventById, registerForEvent } from "../../services/eventsApi";

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();

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

  const handleFreeRegistration = async () => {
    Alert.alert("Confirm Registration", "Do you want to register?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const token = await getToken();
            await registerForEvent(event.id, null, token);
            Alert.alert("Success", "Registered successfully!");
          } catch (err) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  const handlePaidRegistration = async (method) => {
    try {
      const token = await getToken();
      await registerForEvent(event.id, method, token);
      Alert.alert("Success", "Registered successfully!");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!event) {
    return <Text style={{ textAlign: "center" }}>Event not found.</Text>;
  }

  return (
    //     <View style={styles.container}>
    //   {/* HEADER */}
    //   <View style={styles.header}>
    //     <TouchableOpacity onPress={() => router.back()}>
    //       <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
    //     </TouchableOpacity>
    //     <Text style={styles.headerTitle}>Events</Text>
    //     <View style={{ width: 24 }} />
    //   </View>

    <ScrollView style={styles.container}>
      <Image source={{ uri: event.banner_url }} style={styles.banner} />

      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>

        <Text style={styles.meta}>
          📅 {event.event_date} • ⏰ {event.event_time}
        </Text>

        <Text style={styles.meta}>📍 {event.location}</Text>

        <Text style={styles.meta}>💰 {event.registration_fee}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{event.description}</Text>

        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity> */}
        {event.status === "completed" ? (
          <Text style={{ color: "red", marginTop: 20 }}>
            Registration closed
          </Text>
        ) : !event.is_paid ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleFreeRegistration()}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        ) : (
          <>
            {!showPaymentOptions ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowPaymentOptions(true)}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handlePaidRegistration("Online")}
                >
                  <Text style={styles.buttonText}>Pay Online</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#888" }]}
                  onPress={() => handlePaidRegistration("Cash")}
                >
                  <Text style={styles.buttonText}>Pay Cash</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2F346E",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
});
