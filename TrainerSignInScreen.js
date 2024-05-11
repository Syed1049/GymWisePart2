import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { supabase } from './supabase'; // Import your supabase instance
import { saveTrainerSession } from './SessionService'; // Import your session service function

const TrainerSignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [trainerId, setTrainerId] = useState(null);
  const [error, setError] = useState(null);

  const handleSignUpPress = () => {
    navigation.navigate('TrainerSignUpScreen');
  };

  const handleLogin = async () => {
    // Check if email and password are empty
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      // Fetch trainer data from the 'trainer' table based on email
      const { data: trainerData, error: trainerError } = await supabase
        .from('trainer')
        .select('id, email, password') // Include other necessary fields
        .eq('email', email)
        .single();
  
      if (trainerError) {
        console.error('Error fetching trainer data:', trainerError.message);
        return;
      }
  
      // Check if trainer exists and password matches
      if (trainerData && trainerData.password === password) {
        console.log('Trainer logged in successfully:', trainerData);
  
        // Save trainer ID in the state
        setTrainerId(trainerData.id);
        saveTrainerSession(trainerData.id); // Save trainer session
        // Navigate to the trainer dashboard or home screen
        navigation.navigate('TrainerDashboardScreen');
      } else {
        console.log('Invalid email or password.');
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  useEffect(() => {
    if (trainerId) {
      navigation.navigate('TrainerDashboardScreen');
    }
  }, [trainerId, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('./Gw.png')} // Change this to the path of your logo image
          style={styles.logo}
        />
      </View>
      <Text style={styles.heading}>Trainer Sign In</Text>
      <View style={styles.fieldContainer}>
        <View style={styles.inputWithLabel}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputWithLabel}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" style={[styles.button, styles.confirmButton]} onPress={handleLogin}>
          Confirm
        </Button>
        <TouchableOpacity style={styles.button} onPress={handleSignUpPress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 100,
  },
  heading: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingHorizontal: 30,
  },
  fieldContainer: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  inputWithLabel: {
    marginBottom: 10,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 40,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#333',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#CA9329',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default TrainerSignInScreen;
