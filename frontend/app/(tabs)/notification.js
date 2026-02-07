// app/(tabs)/notification.js
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getNotifications } from "../../services/notificationService.js";
import { groupNotifications } from "../../utils/notificationUtils.js";




export default function NotificationScreen() {
  const [notifications, setNotifications] = useState({ 
    today: [], 
    weekly: [], 
    older: [] 
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      const grouped = groupNotifications(data);
      setNotifications(grouped);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const renderNotification = (item) => (
    <View key={item.id} style={[
      styles.notificationCard,
      { borderLeftColor: getPriorityColor(item.priority) }
    ]}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        {item.priority && (
          <View style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(item.priority) }
          ]}>
            <Text style={styles.priorityText}>
              {item.priority.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTime}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#ff4444';
      case 'medium':
        return '#ffaa00';
      case 'low':
        return '#44ff44';
      default:
        return '#cccccc';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text onPress={fetchNotifications} style={styles.retryText}>
          Tap to retry
        </Text>
      </View>
    );
  }

  const hasNotifications = notifications.today.length > 0 || 
                          notifications.weekly.length > 0 || 
                          notifications.older.length > 0;

  if (!hasNotifications) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No notifications yet</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {notifications.today.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {notifications.today.map(renderNotification)}
        </View>
      )}

      {notifications.weekly.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          {notifications.weekly.map(renderNotification)}
        </View>
      )}

      {notifications.older.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Older</Text>
          {notifications.older.map(renderNotification)}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  notificationMessage: {
    marginTop: 4,
    color: '#666',
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  retryText: {
    color: '#0000ff',
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});


