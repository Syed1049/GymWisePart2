import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../supabase';
import LoginScreen from './LoginScreen';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUpPress = async () => {
    // Check if any field is empty
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
  
    // Check if the password meets the criteria (at least 6 characters with alphabets, numbers, and special characters)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert('Error', 'Please enter a valid password (at least 6 characters with alphabets, numbers, and special characters).');
      return;
    }
  
    try {
      // Check if the email already exists in the database
      const { data: existingUsers, error: existingUsersError } = await supabase
        .from('User')
        .select()
        .eq('email', email);
  
      if (existingUsersError) {
        Alert.alert('Error', 'Error checking existing users: ' + existingUsersError.message);
        console.error('Error checking existing users:', existingUsersError.message);
        return;
      }
  
      if (existingUsers.length > 0) {
        Alert.alert('Error', 'This email is already registered.');
        return;
      }
  
      // Use Supabase's auth method for user registration
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        Alert.alert('Error', 'Error registering user: ' + error.message);
        console.error('Error registering user:', error.message);
        // Handle registration error
      } else {
        console.log('User registered successfully:', user);
  
        // Add a new row to the user table with the user's email and password
        const { data, error: profileError } = await supabase
          .from('User')
          .upsert([
            {
              username,
              email,
              password, // Add the password field
            },
          ]);
  
        if (profileError) {
          Alert.alert('Error', 'Error updating user table: ' + profileError.message);
          console.error('Error updating user table:', profileError.message);
          // Handle user table update error
        } else if (data && data.length > 0) {
          console.log('User table updated successfully:', data[0]);
          // Handle successful user table update, e.g., navigate to another screen
          navigation.navigate('LoginScreen');
        } else {
          Alert.alert('Error', 'Unexpected response from user table update: ' + JSON.stringify(data));
          console.error('Unexpected response from user table update:', data);
          // Handle unexpected response
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Error registering user: ' + error.message);
      console.error('Error registering user:', error.message);
    }
  };
  

  const handleLogInPress = () => {
    navigation.navigate('SignInScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../Gw.png')} // Change this to the path of your logo image
          style={styles.logo}
        />
      </View>
      <Text style={styles.heading}>Sign Up</Text>
      <View style={styles.fieldContainer}>
        <View style={styles.inputWithLabel}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputWithLabel}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputWithLabel}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogInPress}>
          <Text style={styles.buttonText}>LogIn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleSignUpPress}>
          <Text style={styles.buttonText}>Confirm</Text>
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
    textAlign: 'left', // Align text to the left
    alignSelf: 'flex-start', // Align text to the start of its container
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
});

export default SignUpScreen;
