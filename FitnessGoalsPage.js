import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Additional screens
import MembershipPage from './MembershipPage';
import TrainerPage from './TrainerPage';
import FitnessGoalsPage from './FitnessGoalsPage';
import AttendancePage from './AttendancePage';
import RecentActivityPage from './RecentActivityPage';

const Stack = createStackNavigator();

const MembershipScreen = () => (
  <View>
    <Text>Membership Page</Text>
    {/* Add Membership Page Content Here */}
  </View>
);

const TrainerScreen = () => (
  <View>
    <Text>Trainer Page</Text>
    {/* Add Trainer Page Content Here */}
  </View>
);

const FitnessGoalsScreen = () => (
  <View>
    <Text>Fitness Goals Page</Text>
    {/* Add Fitness Goals Page Content Here */}
  </View>
);

const AttendanceScreen = () => (
  <View>
    <Text>Attendance Page</Text>
    {/* Add Attendance Page Content Here */}
  </View>
);

const RecentActivityScreen = () => (
  <View>
    <Text>Recent Activity Page</Text>
    {/* Add Recent Activity Page Content Here */}
  </View>
);

const FitnessDashboard = ({ navigation }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Membership" component={MembershipScreen} />
        <Stack.Screen name="Trainer" component={TrainerScreen} />
        <Stack.Screen name="FitnessGoals" component={FitnessGoalsScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen name="RecentActivity" component={RecentActivityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* ... (your existing JSX) */}
      <Image
        source={require('./assets/GymwiseLogo.png')}  
        style={styles.logo}
        resizeMode="contain"
      />
      {/* Membership Information */}
      <TouchableOpacity
        style={styles.sectionContainer}
        onPress={() => navigation.navigate('Membership')}
      >
        <Text style={styles.label}>Membership</Text>
        <Text style={styles.data}>1</Text>
      </TouchableOpacity>

      {/* Trainers Information */}
      <TouchableOpacity
        style={styles.sectionContainer}
        onPress={() => navigation.navigate('Trainer')}
      >
        <Text style={styles.label}>Trainers</Text>
        <Text style={styles.data}>1</Text>
      </TouchableOpacity>

      {/* Fitness Goals Information */}
      <TouchableOpacity
        style={styles.sectionContainer}
        onPress={() => navigation.navigate('FitnessGoals')}
      >
        <Text style={styles.label}>Fitness Goals</Text>
        <Text style={styles.data}>Weight Loss</Text>
      </TouchableOpacity>

      {/* Attendance Information */}
      <TouchableOpacity
        style={styles.sectionContainer}
        onPress={() => navigation.navigate('Attendance')}
      >
        <Text style={styles.label}>Attendance</Text>
        <Text style={styles.data}>80%</Text>
      </TouchableOpacity>

      {/* Scan Button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => console.log('Scan button pressed')}
      >
        <Text style={styles.scanButtonText}>Scan</Text>
      </TouchableOpacity>

      {/* Recent Activity */}
      <TouchableOpacity
        style={styles.recentActivityContainer}
        onPress={() => navigation.navigate('RecentActivity')}
      >
        <Text style={styles.recentActivityTitle}>Recent Activity</Text>
        {/* Add your recent activity content script here */}
      </TouchableOpacity>
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
