import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const DashboardScreen = () => {
  const navigation = useNavigation(); // Hook to access the navigation prop
  const logo = require('./assets/GymwiseLogo.png');
  // Array of menu items
  const menuItems = [
    { id: '1', title: 'Memberships', icon: require('./assets/MemberCard.png') },
    { id: '2', title: 'Trainers', icon: require('./assets/Trainer.png') },
    { id: '3', title: 'Schedules', icon: require('./assets/Calendar.png') },
    { id: '4', title: 'Goals', icon: require('./assets/Goal.png') },
    { id: '5', title: 'Diet Plan', icon: require('./assets/DietPlan.png') },
    { id: '6', title: 'Guest Pass', icon: require('./assets/GuestPass.png') },
    { id: '7', title: 'Support', icon: require('./assets/CustomerSupport.png') },
    { id: '8', title: 'Scan', icon: require('./assets/Scan.png') },
    { id: '9', title: 'Store', icon: require('./assets/Shop.png') },
  ];

  // Function to handle navigation on button press
  const handleNavigation = (screen) => {
    navigation.navigate(screen); // Using the navigate function with the screen name
  };

  // Render function for menu items
  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        // Determine which screen to navigate to based on the item's title
        let screenName = '';
        switch (item.title) {
          case 'Memberships':
            screenName = 'MembershipPage';
            break;
            
            case 'Trainers':
              screenName = 'TrainersPage';
              break;
            case 'Schedules':
              screenName = 'UpcomingBookingsPage';
              break;
              case 'Goals':
            screenName = 'GoalsScreen';
            break;
            
            case 'Diet Plan':
              screenName = 'DietPlanPage';
              break;
            case 'GuestPlans':
              screenName = 'GuestPlans';
              break;
              case 'Support':
            screenName = 'MemberSupportScreen';
            break;
            
            case 'Scan':
              screenName = 'Scan';
              break;
            case 'Store':
              screenName = 'Store';
              break;
          default:
            screenName = 'OtherScreen'; // A generic catch-all for other screens
            break;
        }
        handleNavigation(screenName);
      }}
    >
      <Image source={item.icon} style={styles.menuIcon} />
      <Text style={styles.menuTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Component UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Text style={styles.dashboardTitle}>Your Fitness Dashboard</Text>
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

// Styles for the component
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
    paddingVertical: 16,
  },
  menuGrid: {
    paddingHorizontal: 5,
  },
  menuRow: {
    justifyContent: 'space-evenly',
    marginBottom: 16,
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
    width: 60,
    height: 60,
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

export default DashboardScreen;

