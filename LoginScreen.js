// LoginScreen.js
import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button, TextInput as PaperInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './supabase';
import { saveUserSession } from './SessionService';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  


  const [userId, setUserId] = useState(null); // State to store user ID
  const [error, setError] = useState(null); // State to store login error

  const handleLogin = async () => {
    try {
      // Fetch user data from the 'User' table based on email
      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('id, email, password') // Include other necessary fields
        .eq('email', email)
        .single();
  
      if (userError) {
        console.error('Error fetching user data:', userError.message);
        return;
      }
  
      // Check if user exists and password matches
      if (userData && userData.password === password) {
        console.log('User logged in successfully:', userData);
  
        // Save user ID in the state
        setUserId(userData.id);
        saveUserSession(userData.id);
        // Navigate to the home screen or user dashboard
        navigation.navigate('UserDashboard');
      } else {
        console.log('Invalid email or password.');
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };
  useEffect(() => {
    if (userId) {
      navigation.navigate('UserDashboard');
    }
  }, [userId, navigation]);
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <PaperInput
        style={styles.input}
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <PaperInput
        style={styles.input}
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Login
      </Button>
      <TouchableOpacity style={styles.registerLink} onPress={() => console.log('Navigate to register')}>
        <Text style={styles.registerText}>Don't have an account? Register here</Text>
      </TouchableOpacity>
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
    marginBottom: 30,
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
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: '#3498db',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
