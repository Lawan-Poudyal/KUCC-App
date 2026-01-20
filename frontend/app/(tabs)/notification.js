import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getNotifications } from "../../services/notificationService";
import { groupNotifications } from "../../utils/notificationUtils";

export default function NotificationScreen() {
 const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function load() {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  load();
}, []);
 const grouped = groupNotifications(notifications);
 function openNotification(item) {
    setSelectedNotification(item);
  }

  function goBack() {
    setSelectedNotification(null);
  }

  /*  FULL SCREEN LOADER  */
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5A67F8" />
        <Text style={styles.loadingText}>
          Generating notification details...
        </Text>
      </View>
    );
  }

  /*  DETAIL VIEW*/
  if (selectedNotification) {
    return (
      <View style={styles.detailContainer}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        <Ionicons
          name="notifications-outline"
          size={60}
          color="#5A67F8"
          style={{ marginBottom: 20 }}
        />

        <Text style={styles.detailTitle}>
          {selectedNotification.title}
        </Text>
       <Text style={styles.detailTime}>
          {new Date(selectedNotification.created_at).toLocaleString()}
        </Text>
        
        <Text style={styles.detailDesc}>
          {selectedNotification.message}
        </Text>
      </View>
    );
  }

  /*  MAIN LIST  */
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <Ionicons name="notifications-outline" size={26} color="#333" />
      </View>

      {/* Clear all */}
      <TouchableOpacity style={styles.clearButton}>
        <Text style={styles.clearText}>Clear all</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Today */}
        <Text style={styles.sectionTitle}>Today</Text>
       {grouped.today.map((item) => (
          <NotificationCard
            key={item.id}
            item={{
              title: item.title,
              description: item.message,
              time: new Date(item.created_at).toLocaleTimeString(),
            }}
            onPress={() => openNotification(item)}
          />
        ))}

        {/* Earlier */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
          Earlier this week
        </Text>
          {grouped.weekly.map((item) => (
          <NotificationCard
            key={item.id}
            item={{
              title: item.title,
              description: item.message,
              time: new Date(item.created_at).toLocaleDateString(),
            }}
            onPress={() => openNotification(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/*CARD */
function NotificationCard({ item, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

/*  STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F9",
    paddingTop: 55,
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },

  clearButton: {
    alignSelf: "flex-end",
    marginVertical: 8,
  },

  clearText: {
    color: "#5A67F8",
    fontWeight: "500",
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
    marginTop: 10,
  },

  scrollContainer: {
    paddingBottom: 150,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    color: "#222",
  },

  cardDesc: {
    fontSize: 13,
    color: "#555",
    marginBottom: 10,
  },

  timeText: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
    fontStyle: "italic",
  },

  /* LOADER */
  loaderContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: "#555",
  },

  /* DETAIL */
  detailContainer: {
    flex: 1,
    backgroundColor: "#F7F7F9",
    paddingTop: 70,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    top: 55,
    left: 18,
  },

  detailTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  detailTime: {
    fontSize: 12,
    color: "#777",
    marginBottom: 20,
  },

  detailDesc: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    textAlign: "center",
  },
});
