// UserDashboard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { clearUserSession } from './SessionService';

const UserDashboard = () => {
  const navigation = useNavigation();

  const navigateToMemberSupport = () => {
    navigation.navigate('MemberSupportScreen');
  };

  const navigateToGymTraining = () => {
    // You can replace 'GymTrainingScreen' with the actual screen name for gym training
    navigation.navigate('TutorialHome');
  };

  const handleSignOut = async () => {
    try {
      // Clear user session when signing out
      await clearUserSession();
      
      // Navigate to the login or authentication screen
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error signing out:', error.message);
      Alert.alert('Error', 'An error occurred while signing out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Dashboard</Text>

      <TouchableOpacity style={styles.option} onPress={navigateToMemberSupport}>
        <Ionicons name="chatbox" size={24} color="#3498db" />
        <Text style={styles.optionText}>Member Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={navigateToGymTraining}>
        <Ionicons name="barbell" size={24} color="#e74c3c" />
        <Text style={styles.optionText}>Gym Training</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out" size={24} color="#c0392b" />
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  optionText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#333333',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  signOutButtonText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#c0392b', // Red color for sign-out
  },
});

export default UserDashboard;
