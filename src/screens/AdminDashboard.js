import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboard = () => {
  const navigation = useNavigation(); // Hook to access the navigation prop
  const logo = require('../../assets/GymwiseLogo.png');
  // Array of menu items
  const menuItems = [
    { id: '1', title: 'Memberships', icon: require('../../assets/MemberCard.png') },
    { id: '2', title: 'Trainers', icon: require('../../assets/Trainer.png') },
    { id: '3', title: 'Schedules', icon: require('../../assets/Calendar.png') },
    { id: '4', title: 'Goals', icon: require('../../assets/Goal.png') },
    { id: '5', title: 'Diet Plan', icon: require('../../assets/DietPlan.png') },
    { id: '6', title: 'Guest Pass', icon: require('../../assets/GuestPass.png') },
    { id: '7', title: 'Support', icon: require('../../assets/CustomerSupport.png') },
    { id: '8', title: 'Scan', icon: require('../../assets/Scan.png') },
    { id: '9', title: 'Store', icon: require('../../assets/Shop.png') },
  ];

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        let screenName = '';
        switch (item.title) {
          case 'Equipment Dashboard':
            screenName = 'EquipmentHomeScreen';
            break;
          case 'Manage Support Requests':
            screenName = 'ManageSupportRequestsScreen';
            break;
          case 'Manage Store Options':
            screenName ='AddItemScreen';
            break;
          case 'Set Gym Timings':
            screenName = 'SetGymTimingsScreen';
            break;
          case 'Send Notifications':
            screenName = 'SendNotificationScreen';
            break;
          default:
            screenName = 'SendNotificationScreen';
            break;
        }
        handleNavigation(screenName);
      }}
    >
      <Ionicons name={item.icon} size={60} color="white" style={styles.menuIcon} />
      <Text style={styles.menuTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Text style={styles.dashboardTitle}>Admin Dashboard</Text>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.menuGrid}
      />
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010102',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 200,
    height: 110,
    resizeMode: 'contain',
  },
  dashboardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingVertical: 20,
  },
  menuGrid: {
    paddingHorizontal: 5,
  },
  menuItem: {
    backgroundColor: 'transparent',
    borderColor: '#CB952B',
    borderWidth: 2,
    borderRadius: 10,
    width: 105,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7,
  },
  menuIcon: {
    marginBottom: 8,
  },
  menuTitle: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 15,
    width: 150,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#CA9329',
    alignItems: 'center',
    marginTop: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;
