import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { getUserSession } from './SessionService';
import { supabase } from './supabase';

const GoalsScreen = () => {
  const [savedGoals, setSavedGoals] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserSession();
  }, []);

  const fetchUserSession = async () => {
    try {
      const session = await getUserSession();
      if (session && session.userId) {
        await setSavedGoals([]); // Clear previous goals
        await fetchSavedGoals(session.userId);
      }
    } catch (error) {
      console.error('Error fetching user session:', error.message);
      setLoading(false); // Update loading status in case of error
    }
  };

  const fetchSavedGoals = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('workoutplans')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      setSavedGoals(data || []);
    } catch (error) {
      console.error('Error fetching saved goals:', error.message);
    } finally {
      setLoading(false); // Update loading status after fetching goals
    }
  };

  const handlePlusButtonPress = () => {
    navigation.navigate('GoalDetailsScreen');
  };

  const handlePlayButtonPress = (planId) => {
    navigation.navigate('PlanDetailsScreen', { planId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.heading}>Goals</Text>
      </View>

      <View style={styles.searchBar}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color="#CA9329" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#CA9329"
            style={styles.input}
          />
          <Ionicons name="filter" size={20} color="#CA9329" />
        </View>
        <TouchableOpacity style={styles.plusIconContainer} onPress={handlePlusButtonPress}>
          <Ionicons name="add" size={30} color="#CA9329" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#CA9329" />
      ) : (
        <ScrollView style={styles.goalContainer}>
          {savedGoals.map((goal, index) => (
            <View key={index} style={styles.savedGoalContainer}>
              <TouchableOpacity style={styles.goalCard} >
          
                <Text style={styles.goalName}>{goal.plan_name} </Text>
                <Ionicons name="play-circle" size={24} color="#CA9329" style={styles.playButton} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
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
    marginBottom: 20,
    backgroundColor: '#000',
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
    backgroundColor: '#333333',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flex: 1,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
  },
  plusIconContainer: {
    marginLeft: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalContainer: {
    flex: 1,
  },
  savedGoalContainer: {
    marginBottom: 10,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 20,
  },
  goalName: {
    fontSize: 18,
    color: '#CA9329',
    marginRight: 10, // Add some spacing between the goal name and the play button
  },
  playButton: {
    marginLeft: 'auto', // Align the play button to the right edge of the card
  },
});

export default GoalsScreen;
