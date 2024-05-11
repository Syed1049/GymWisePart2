import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, FlatList, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const TrainerDashboardScreen = () => {
  const navigation = useNavigation();
  const logo = require('./assets/GymwiseLogo.png');
  
  const menuItems = [
    { id: '1', title: 'Gym Sessions', icon: 'heartbeat' },
    { id: '2', title: 'Courses', icon: 'graduation-cap' },
    { id: '3', title: 'Support', icon: 'life-ring' },
    { id: '4', title: 'Salary', icon: 'money' },
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
          case 'Gym Sessions':
            screenName = 'SessionsScreen';
            break;
          case 'Courses':
            screenName = 'CoursesScreen';
            break;
          case 'Support':
            screenName = 'TrainerSupportScreen';
            break;
          case 'Salary':
            screenName = 'SalaryScreen';
            break;
          default:
            screenName = 'OtherScreen';
            break;
        }
        handleNavigation(screenName);
      }}
    >
      <Icon name={item.icon} size={40} color="white" style={styles.menuIcon} />
      <Text style={styles.menuTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Text style={styles.dashboardTitle}>Trainer Dashboard</Text>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
    paddingVertical: 16,
  },
  menuGrid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  menuItem: {
    backgroundColor: 'transparent',
    borderColor: '#CB952B',
    borderWidth: 2,
    borderRadius: 10,
    width: '45%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  menuIcon: {
    marginBottom: 10,
  },
  menuTitle: {
    color: 'white',
    fontSize: 16,
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
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TrainerDashboardScreen;
