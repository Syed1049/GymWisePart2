import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import AsyncStorage from "@react-native-async-storage/async-storage";
import PurchaseMembership from "./purchaseMembership";
import MembershipPayment from "./membershipPayment";
import { supabase } from '../../supabase'; // Import your supabase instance
import { useFocusEffect } from '@react-navigation/native';
import{clearUserSession} from './SessionService'

// Set up Supabase client
// const supabaseUrl = 'https://rjuibysbrnwraxvzavtk.supabase.co';
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdWlieXNicm53cmF4dnphdnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2MjQ3NTYsImV4cCI6MjAyMDIwMDc1Nn0.CiJnaPdlOFS17nF4zz3iePJnpEVd0skjRK1Q9wR9XKQ';
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // Function to fetch membership status from Supabase
// const fetchMembershipStatus = async (userId) => {
//   const { data, error } = await supabase
//     .from('user')  // Replace 'tableName' with your actual table name
//     .select('membership')
//     .eq('user_id', userId)  // Assuming 'user_id' is how users are identified in your table
//     .single();

//   if (error) {
//     console.error('Error fetching membership status:', error);
//     return false;
//   }

//   return data.membership;
// };

const DashboardScreen =  () => {
  const [userData, setUserData] = useState(null)

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      const parsedUserData = JSON.parse(storedUserData);

      const { data, error } = await supabase
        .from("User")
        .select('*')
        .eq("id", parsedUserData?.id)
        .single();

      if (error) {
        console.error('Error fetching membership status:', error);
      } else {
        setUserData(data);
        await AsyncStorage.setItem('userData', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  console.log('Current userData state:', userData); // Log current state

  if (!userData) {
    console.log('userData is null, showing loading...'); // Log loading state
    return <Text>Loading...</Text>;
  }

  const navigation = useNavigation(); // Hook to access the navigation prop
  const logo = require("../../assets/GymwiseLogo.png");
  // const [isMember, setIsMember] = useState(null);

  // useEffect(() => {
  //   const userId = 'your-user-id'; // This should come from your user authentication logic
  //   fetchMembershipStatus(userId).then(setIsMember);
  // }, []);

  // if (isMember === null) {
  //   return <Text>Loading...</Text>;  // Loading state while checking the database
  // }

  // if (!isMember) {
  //   // Redirect to Payment Screen or show payment modal
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.dashboardTitle}>Membership Payment Required</Text>
  //       <Button title="Go to Payment" onPress={() => navigation.navigate('PaymentScreen')} />
  //     </View>
  //   );
  // }
  // Array of menu items
  const menuItems = [
    { id: "1", title: "Memberships", icon: require("../../assets/MemberCard.png") },
    { id: "2", title: "Trainers", icon: require("../../assets/Trainer.png") },
    { id: "3", title: "Schedules", icon: require("../../assets/Calendar.png") },
    { id: "4", title: "Goals", icon: require("../../assets/Goal.png") },
    { id: "5", title: "Meal Plan", icon: require("../../assets/DietPlan.png") },
    // { id: "6", title: "Guest Pass", icon: require("./assets/GuestPass.png") },
    {
      id: "7",
      title: "Support",
      icon: require("../../assets/CustomerSupport.png"),
    },
    // { id: "8", title: "Scan", icon: require("./assets/Scan.png") },
    { id: "9", title: "Store", icon: require("../../assets/Shop.png") },
  ];

  // Function to handle navigation on button press
  const handleNavigation = (screen) => {
    console.log("screen", screen);
    navigation.navigate(screen); // Using the navigate function with the screen name
  };
const handlelogoutpress=()=>{

    try {
     clearUserSession(); // Call the clearUserSession function to clear the user session
      // Navigate to the login screen or any other desired screen after logout
      navigation.navigate('SignInScreen');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }

};

  console.log(userData);

  // Render function for menu items
  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        // Determine which screen to navigate to based on the item's title
        let screenName = "";
        switch (item.title) {
          case "Memberships":
            screenName = "MembershipPage";
            break;
            
            case 'Trainers':
              screenName = 'TrainerListScreen';
              break;
            case 'Schedules':
              screenName = 'UpcomingBookingsPage';
              break;
              case 'Goals':
            screenName = 'GoalsScreen';
            break;
            
            case 'Meal Plan':
              screenName = 'MealPlanPage';
            case 'Diet Plan':
              screenName = 'TutorialHome';
              break;
            case 'Notifications':
              screenName = 'NotificationScreen';
              break;
              case 'Support':
            screenName = 'MemberSupportScreen';
            break;

          // case "Scan":
          //   screenName = "Scan";
          //   break;
          case "Store":
            screenName = "Store";
            break;
          default:
            screenName = "Otherscreen"; // A generic catch-all for other screens
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

      {userData && userData?.membership ? (
        <FlatList
          data={menuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.menuGrid}
        />
      ) : (
    navigation.navigate('MembershipPayment')
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={()=>navigation.navigate("SignInScreen")}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#010102",
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
  },
  logo: {
    width: 200,
    height: 110,
    resizeMode: "contain",
  },
  dashboardTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    paddingVertical: 16,
  },
  menuGrid: {
    paddingHorizontal: 5,
  },
  menuRow: {
    justifyContent: "space-evenly",
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: "transparent",
    borderColor: "#CB952B",
    borderWidth: 2,
    borderRadius: 10,
    width: 105,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    margin: 7,
  },
  menuIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  menuTitle: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 15,
    width: 150,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#CA9329",
    alignItems: "center",
    marginTop: 5,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DashboardScreen;
