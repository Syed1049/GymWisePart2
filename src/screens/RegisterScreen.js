import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, TextInput as PaperInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; 
import { supabase } from '../../supabase';
import LoginScreen from './LoginScreen';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); 

  const handleRegister = async () => {
    try {
      // Use Supabase's auth method for user registration
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Error registering user:', error.message);
        // Handle registration error
      } else {
        console.log('User registered successfully:', user);

        // Add a new row to the user table with the user's email and password
        const { data, error: profileError } = await supabase
          .from('User')
          .upsert([
            {
              email,
              password, // Add the password field
            },
          ]);

        if (profileError) {
          console.error('Error updating user table:', profileError.message);
          // Handle user table update error
        } else if (data && data.length > 0) {
          console.log('User table updated successfully:', data[0]);
          // Handle successful user table update, e.g., navigate to another screen
          navigation.navigate('LoginScreen');
        } else {
          console.error('Unexpected response from user table update:', data);
          // Handle unexpected response
        }
      }
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
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
      <Button mode="contained" style={styles.button} onPress={handleRegister}>
        Register
      </Button>
      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate('LoginScreen')} 
      >
        <Text style={styles.loginText}>Already have an account? Login here</Text>
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
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: '#3498db',
  },
});

export default RegisterScreen;
