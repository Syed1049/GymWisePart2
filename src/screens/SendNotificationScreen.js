import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { supabase } from '../../supabase';

const SendNotificationScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Fetch users from the database
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('User').select('*');
      if (error) {
        throw new Error(error.message);
      }
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  // Toggle selection for users
  const toggleUserSelection = (userId) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Send notifications to selected users
const sendNotifications = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user.');
      return;
    }
  
    if (!notificationMessage.trim()) {
      alert('Please enter a notification message.');
      return;
    }
  
    try {
      // Get the current timestamp
      const currentTimestamp = new Date().toISOString();
  
      // Insert notification into the database
      const { data, error } = await supabase
        .from('user_notification')
        .insert(selectedUsers.map(userId => ({
          user_id: userId,
          notification_text: notificationMessage,
          is_read: false,
          timestamp: currentTimestamp, // Include the current timestamp
        })));
  
      if (error) {
        throw new Error(error.message);
      }
  
      // Log the successful insertion
      console.log('Notification inserted successfully:', data);
  
      // Placeholder implementation, replace with actual logic
      alert('Notifications sent successfully!');
    } catch (error) {
      console.error('Error sending notifications:', error.message);
    }
  };
  
  // Render function for users list
  const renderUserList = () => {
    return users.map(user => (
      <TouchableOpacity
        key={user.id}
        style={[styles.item, selectedUsers.includes(user.id) && styles.selectedItem]}
        onPress={() => toggleUserSelection(user.id)}
      >
        <Text style={styles.itemText}>{user.username}</Text>
      </TouchableOpacity>
    ));
  };

  // Component UI
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Send Notification</Text>
        <ScrollView>
          <View>
            <Text style={styles.sectionHeading}>Users</Text>
            {renderUserList()}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Type your notification message..."
            value={notificationMessage}
            onChangeText={setNotificationMessage}
            multiline
          />
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={sendNotifications}>
          <Text style={styles.buttonText}>Send Notifications</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010102',
    padding: 20,
  },
  content: {
    flex: 1,
  },
  heading: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeading: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#333',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  selectedItem: {
    backgroundColor: '#CA9329',
  },
  itemText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: 'black',
  },
  button: {
    backgroundColor: '#CA9329',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SendNotificationScreen;
