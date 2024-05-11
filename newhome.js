import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NewHome = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigation = useNavigation();
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('./Gw.png')} // Change this to the path of your logo image
          style={styles.logo}
        />
      </View>
      <Text style={styles.selectRoleText}>Select Role</Text>
      <View style={styles.roleButtonContainer}>
      <TouchableOpacity
        style={[styles.roleButton, selectedRole === 'Member' && styles.selectedButton]}
        onPress={() => {
          handleRoleSelect('Member');
     
        }}
      >
        <Text style={styles.buttonText}>Member</Text>
      </TouchableOpacity>
        {/* <TouchableOpacity
          style={[styles.roleButton, selectedRole === 'Trainer' && styles.selectedButton]}
          onPress={() => handleRoleSelect('Trainer')}
        >
          <Text style={styles.buttonText}>Trainer</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.roleButton, selectedRole === 'Admin' && styles.selectedButton]}
          onPress={() => handleRoleSelect('Admin')}
          
        >
          <Text style={styles.buttonText}>Admin</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.authButtonsContainer}>
      <TouchableOpacity
          style={styles.authButton}
          onPress={() => {
            if (selectedRole === 'Member') {
              navigation.navigate('SignUpScreen');
            }
            if (selectedRole === 'Admin') {
              navigation.navigate('AdminLoginScreen');
            }
            if (selectedRole === 'Trainer') {
              navigation.navigate('TrainerSignUpScreen');
            }
             

          }}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authButton} onPress={() => {
            if (selectedRole === 'Member') {
              navigation.navigate('SignInScreen');
       
            }
            if (selectedRole === 'Trainer') {
              navigation.navigate('TrainerSignInScreen');
       
            }
          }
          
          }>
          
          <Text style={styles.buttonText}>Sign In</Text>
          
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
  selectRoleText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'left', // Align text to the left
    alignSelf: 'flex-start', // Align text to the start of its container
    paddingHorizontal: 30,
  },
  roleButtonContainer: {
    backgroundColor: '#222', // Blackish grey background color
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  roleButton: {
    borderRadius: 30, // Increased border radius to make buttons round
    backgroundColor: '#333',
    paddingVertical: 10, // Increased padding to make buttons bigger
    paddingHorizontal: 80, // Increased padding to make buttons bigger
    marginVertical: 5,
    marginHorizontal :30,
    alignItems: 'center', // Center align text horizontally
  },
  selectedButton: {
    backgroundColor: '#CA9329',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  authButtonsContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Evenly space buttons along the row
    width: '100%', // Take full width of parent container
    paddingHorizontal: 10, // Add horizontal padding for spacing
  },
  authButton: {
    borderRadius: 30,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#CA9329',
  },
  
});

export default NewHome;
