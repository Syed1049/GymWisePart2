import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../supabase';

const TrainerSignUpScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Calculate BMI whenever weight or height changes
  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100; // Convert height to meters
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBMI(bmiValue);
    }
  }, [weight, height]);

  const handleSignUpPress = async () => {
    // Check if any field is empty
    if (!name || !email || !password || !age || !weight || !height || !bmi || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Check if age, weight, height, BMI are numeric
    if (isNaN(age) || isNaN(weight) || isNaN(height) || isNaN(bmi)) {
      Alert.alert('Error', 'Please enter valid numeric values for age, weight, height, and BMI.');
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
      const { data: existingTrainers, error: existingTrainersError } = await supabase
        .from('trainer')
        .select()
        .eq('email', email);
  
      if (existingTrainersError) {
        Alert.alert('Error', 'Error checking existing trainers: ' + existingTrainersError.message);
        console.error('Error checking existing trainers:', existingTrainersError.message);
        return;
      }
  
      if (existingTrainers.length > 0) {
        Alert.alert('Error', 'This email is already registered.');
        return;
      }
  
      // Use Supabase's auth method for trainer registration
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        Alert.alert('Error', 'Error registering trainer: ' + error.message);
        console.error('Error registering trainer:', error.message);
      } else {
        console.log('Trainer registered successfully:', user);
  
        // Add a new row to the trainer table with the trainer's details
        const { data, error: profileError } = await supabase
          .from('trainer')
          .upsert([
            {
              name,
              email,
              password,
              age,
              weight,
              height,
              bmi,
              phone_number: phoneNumber
            },
          ]);
  
        if (profileError) {
          Alert.alert('Error', 'Error updating trainer table: ' + profileError.message);
          console.error('Error updating trainer table:', profileError.message);
        } else if (data && data.length > 0) {
          console.log('Trainer table updated successfully:', data[0]);
          navigation.navigate('LoginScreen');
        } else {
          Alert.alert('Error', 'Unexpected response from trainer table update: ' + JSON.stringify(data));
          console.error('Unexpected response from trainer table update:', data);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Error registering trainer: ' + error.message);
      console.error('Error registering trainer:', error.message);
    }
  };
  

  const handleLogInPress = () => {
    navigation.navigate('TrainerSignInScreen');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../Gw.png')} // Change this to the path of your logo image
            style={styles.logo}
          />
        </View>
        <Text style={styles.heading}>Trainer Sign Up</Text>
        <View style={styles.fieldContainer}>
          <View style={styles.inputWithLabel}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
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
          <View style={styles.inputWithLabel}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </View>
          <View style={styles.inputWithLabel}>
            <Text style={styles.label}>Weight</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your weight"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
          <View style={styles.inputWithLabel}>
            <Text style={styles.label}>Height</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your height"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>
          <View style={styles.inputWithLabel}>
            <Text style={styles.label}>BMI</Text>
            <TextInput
              style={styles.input}
              placeholder="BMI"
              placeholderTextColor="#888"
              editable={false}
              value={bmi}
            />
          </View>
          <View style={styles.inputWithLabel}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    flexGrow: 1,
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

export default TrainerSignUpScreen;
