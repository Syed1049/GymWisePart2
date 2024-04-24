import React ,{useState,useEffect}from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { getUserSession } from './SessionService';
import { supabase } from './supabase';
const GoalsScreen = () => {
  const [savedGoals, setSavedGoals] = useState([]);
  const [userId, setUserId] = useState(); // State to hold the user ID
  const navigation = useNavigation(); // Initialize navigation using useNavigation hook

  useEffect(() => {
         fetchUserSession();

      // Function to fetch saved goals from the database
      const fetchSavedGoals = async () => {
  
        console.log(userId);
        try {
          // Fetch goals data from the database
          const { data, error } = await supabase
            .from('workoutplans')
            .select('*')
            .eq('user_id', userId);
  
          if (error) {
            throw new Error(error.message);
          }
  
          // Update state with fetched goals data
          setSavedGoals(data || []);
          console.log(data);
        } catch (error) {
          console.error('Error fetching saved goals:', error.message);
        }
      };
  
      // Call the fetchSavedGoals function to fetch saved goals when the component mounts
      fetchSavedGoals();
    }, []);
  


  const handlePlusButtonPress = () => {
    // Navigate to the screen where you want to add new goals
    navigation.navigate('GoalDetailsScreen');
  };
  const fetchUserSession = async () => {
    try {
      const session = await getUserSession();
      if (session && session.userId) {
        setUserId(session.userId);
      }
    } catch (error) {
      console.error('Error fetching user session:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.heading}>Goals</Text>
        {/* Removed the Add button from the header */}
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        {/* Search Input */}
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color="#CA9329" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#CA9329"
            style={styles.input}
          />
          <Ionicons name="filter" size={20} color="#CA9329" />
        </View>
        {/* Plus Icon */}
        <TouchableOpacity style={styles.plusIconContainer} onPress={handlePlusButtonPress}>
          <Ionicons name="add" size={30} color="#CA9329" />
        </TouchableOpacity>
      </View>

      <View style={styles.blackishGreySection}>
  {/* Display Saved Goals Here */}
  {savedGoals.map((goal, index) => (
    <View key={index} style={styles.blackishGreySection}>
      <Text style={styles.heading}>{goal.plan_name}</Text>
    </View>
  ))}
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    paddingTop: 40,
  },
  header: {
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginBottom: 20, // Adjusted marginBottom to move header down
    backgroundColor:'#000',
  },
  heading: {
    fontSize: 20,
    color: 'white',
  },
  backButton: {
    marginRight: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333', // Blackish grey
    borderRadius: 30, // Adjust the border radius to make it more rounded
    paddingHorizontal: 10,
    paddingVertical: 15, // Increase the vertical padding to make it taller
    flex: 1,
    justifyContent: 'space-between', // Align the search and filter icons to the right
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: 'white', // Set text color to white
  },
  plusIconContainer: {
    marginLeft: 10, // Adjust spacing between search input and plus icon
    
  },
  blackishGreySection: {
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 20,
  
  },
  savedGoalContainer: {
    marginBottom: 10, // Adjust as needed
  },
  goalName: {
    fontSize: 18,
    color: 'white',
  },
});

export default GoalsScreen;
