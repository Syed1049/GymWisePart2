import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { getUserSession } from './SessionService'; // Import getUserSession function

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  // Fetch notifications for the current user from the database
  useEffect(() => {
    fetchUserSession();
 
  }, []);

  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications for user:', userId); // Log the userId
      if (!userId) {
        console.log('User ID is not set'); // Log if userId is not set
        return;
      }

      // Fetch notifications for the current user
      const { data, error } = await supabase
        .from('user_notification')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      // Set the fetched notifications
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
    }
  };

  // Fetch current user from the session
  const fetchUserSession = async () => {
    try {
      const session = await getUserSession();
      if (session && session.userId) {
        setUserId(session.userId);
          fetchNotifications();
      }
    } catch (error) {
      console.error('Error fetching user session:', error.message);
    }
  };

  // Render function for displaying notifications
  const renderNotifications = () => {
    return notifications.map(notification => (
      <View key={notification.id} style={styles.notification}>
        <Text style={styles.notificationText}>{notification.notification_text}</Text>
        <Text style={styles.timestamp}>{notification.timestamp}</Text>
      </View>
    ));
  };

  // Component UI
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {notifications.length === 0 ? (
          <Text style={styles.noNotifications}>No notifications</Text>
        ) : (
          renderNotifications()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010102',
    padding: 20,
  },
  notification: {
    backgroundColor: '#333',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
  },
  timestamp: {
    color: 'gray',
    fontSize: 12,
    marginTop: 5,
  },
  noNotifications: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NotificationScreen;
