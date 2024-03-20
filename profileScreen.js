// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from the mock API
    axios.get('https://example.com/data.json')
      .then(response => setUserData(response.data.user))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
      <Text style={styles.userName}>{userData.name}</Text>
      <Text>{userData.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ProfileScreen;
