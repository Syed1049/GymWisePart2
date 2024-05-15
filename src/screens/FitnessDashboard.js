import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const FitnessDashboard = () => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/GymwiseLogo.png')}  
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title and Menu Button */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your Fitness Dashboard</Text>
        <TouchableOpacity onPress={() => console.log('Menu button pressed')}>
          <Image
            source={require('../../assets/dots.png')}  
            style={styles.menuButton}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Membership Information */}
      <View style={styles.sectionContainer}>
        <Text style={styles.label}>Membership</Text>
        <Text style={styles.data}>1</Text>
      </View>

      {/* Trainers Information */}
      <View style={styles.sectionContainer}>
        <Text style={styles.label}>Trainers</Text>
        <Text style={styles.data}>1</Text>
      </View>

      {/* Fitness Goals Information */}
      <View style={styles.sectionContainer}>
        <Text style={styles.label}>Fitness Goals</Text>
        <Text style={styles.data}>Weight Loss</Text>
      </View>

      {/* Attendance Information */}
      <View style={styles.sectionContainer}>
        <Text style={styles.label}>Attendance</Text>
        <Text style={styles.data}>80%</Text>
      </View>

      {/* Scan Button */}
      <TouchableOpacity style={styles.scanButton} onPress={() => console.log('Scan button pressed')}>
        <Text style={styles.scanButtonText}>Scan</Text>
      </TouchableOpacity>

      {/* Recent Activity */}
      <View style={styles.recentActivityContainer}>
        <Text style={styles.recentActivityTitle}>Recent Activity</Text>
        {/* Add your recent activity content here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#010102',  // Set your desired background color
  },
  // Logo Style
logo: {
  width: 212,  // Make the logo a bit bigger
  height: 79,
  alignSelf: 'center',  // Align the logo in the center horizontally
  marginBottom: 50,
  marginTop: 40,  // Adjust the marginTop to bring the logo down
},

  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white',
  },
  menuButton: {
    width: 30,
    height: 30,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#17171A',  // Set background color for each section container
    padding: 15,
    borderRadius: 12,  // Add rounded corners
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'white',
  },
  data: {
    fontSize: 20,
    color:'white',
  },
  scanButton: {
    backgroundColor: '#17171A',  // Set your desired button color
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  scanButtonText: {
    color: '#fff',  // Set your desired text color
    fontSize: 18,
    fontWeight: 'bold',
  },
  recentActivityContainer: {
    backgroundColor: '#17171A',  // Set background color for the recent activity container
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 20,
  },
  recentActivityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
});

export default FitnessDashboard;
