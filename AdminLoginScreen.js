import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, TextInput as PaperInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const AdminLoginScreen = () => {
  const navigation = useNavigation();
  const [gymCode, setGymCode] = useState('');

  const handleAdminLogin = () => {
    // Implement admin login logic here
    if (gymCode === '1') {
      // Navigate to the admin panel (replace 'AdminHome' with your actual admin screen)
      navigation.navigate('AdminDashboard');
    } else {
      console.log('Invalid gym code for admin');
      // Handle invalid gym code, such as displaying an error message to the admin
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      <PaperInput
        style={styles.input}
        label="Gym Code"
        value={gymCode}
        onChangeText={setGymCode}
      />
      <Button mode="contained" style={styles.button} onPress={handleAdminLogin}>
        Admin Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#3498db',
    marginTop: 10,
  },
});

export default AdminLoginScreen;
