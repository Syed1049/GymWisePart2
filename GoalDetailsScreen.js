import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert,Modal,TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from './supabase';
import { getUserSession } from './SessionService';
const GoalDetailsScreen = () => {
  const [selectedTimeLimit, setSelectedTimeLimit] = useState('');
  const [selectedBodySection, setSelectedBodySection] = useState('');
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState('');
  const [recommendedExercises, setRecommendedExercises] = useState([]); // State to hold recommended exercises
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [userId, setUserId] = useState(null); // State to hold the user ID
  const [planId,setPlanId]=useState();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    fetchUserSession();
    try {
      const timeLimit = parseInt(selectedTimeLimit);
      let fitnessLevel = selectedFitnessLevel;
      const bodySection = selectedBodySection;
  
      let exercises = [];
  
      // Use a temporary variable to track fitness level adjustments
      let fitnessLevelCopy = selectedFitnessLevel;
  
      // Loop until exercises are found or all fitness levels are exhausted
      do {
        exercises = await fetchExercises(bodySection, fitnessLevelCopy);
        fitnessLevelCopy = getNextFitnessLevel(fitnessLevelCopy, false); // Move down a level after each iteration
      } while (exercises.length === 0 && fitnessLevelCopy !== null);
  
      if (exercises.length === 0) {
        throw new Error('No exercises available for any fitness level');
      }
  
      const recommended = recommendExercises(exercises, selectedTimeLimit, selectedFitnessLevel);
      setRecommendedExercises(recommended);
  
      console.log('Recommended Exercises:', recommendedExercises);
  
      navigation.navigate('WorkoutPlanScreen', { recommendedExercises });
  
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to generate workout plan. Please try again.');
    }
  
    const workoutPlanData = {
      plan_name: goalName,
      plan_start_date: selectedDate,
      plan_end_date: selectedDate,
      duration_minutes: parseInt(selectedTimeLimit),
      user_id: userId, // Using the fetched user ID
    };
   
 
    const planId = await saveWorkoutPlan(workoutPlanData);
    console.log(planId);
    await saveRecommendedExercises(recommendedExercises,planId );
    // After getting the plan ID, save recommended exercises
  
  };
  
  
  

  const getNextFitnessLevel = (currentLevel, isUp) => {
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    const currentIndex = levels.indexOf(currentLevel);
    if (isUp && currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    } else if (!isUp && currentIndex > 0) {
      return levels[currentIndex - 1];
    }
    return null; // Return null if there are no more levels in the specified direction
  };

  const fetchExercises = async (bodySection, fitnessLevel) => {
    try {
      const { data, error } = await supabase
        .from('exercise_goals')
        .select('*')
        .eq('exercise_bodysection', bodySection)
        .eq('exercise_level', fitnessLevel)
   
        .order('exercise_title', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        return data;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error('Failed to fetch exercises from the database');
    }
    
   

  };

  const recommendExercises = (exercises, timeLimit, fitnessLevel) => {
    const exercisesByLevel = {
      Beginner: { '30': { sets: 3, reps: 8, count: 6 }, '60': { sets: 3, reps: 8, count: 10 } },
      Intermediate: { '30': { sets: 4, reps: 10, count: 8 }, '60': { sets: 4, reps: 10, count: 12 } },
      Advanced: { '30': { sets: 5, reps: 12, count: 10 }, '60': { sets: 5, reps: 12, count: 15 } }
    };
  
    const maxExercises = exercisesByLevel[fitnessLevel]?.[timeLimit] || 0;
  
    // Check if the maxExercises is an object with sets, reps, and count properties
    if (typeof maxExercises === 'object') {
      const { sets, reps, count } = maxExercises;
      // Generate recommended exercises with the specified sets and reps
      const recommendedExercises = exercises.slice(0, count).map((exercise, index) => {
        return {
          ...exercise,
          sets: sets,
          reps: reps,
          id: exercise.exercise_id, // Using the exercise_id from the database
          name:exercise.exercise_title,
          desc:exercise.exercise_desc,
          equipment:exercise.exercise_equipment,
          bodysection:exercise.exercise_bodysection,
        };
      });
      return recommendedExercises;
    } else {
      // For Intermediate and Advanced levels with direct exercise count
      const recommendedExercises = exercises.slice(0, maxExercises).map((exercise, index) => {
        return {
          ...exercise,
          sets: sets,
          reps: reps,
          id: exercise.exercise_id ,// Using the exercise_id from the database
          name:exercise.exercise_title,
          desc:exercise.exercise_desc,
          equipment:exercise.exercise_equipment,
          bodysection:exercise.exercise_bodysection,
        };
      });
      return recommendedExercises;
    }
  };
  // Function to handle date selection
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
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

  const saveWorkoutPlan = async (workoutPlanData) => {
    try {
      // Insert the workout plan data into the database table named 'workoutplans'
      const { error } = await supabase.from('workoutplans').insert([workoutPlanData]);
  
      if (error) {
        throw new Error(error.message);
      }
  
      console.log('Workout plan saved successfully');
  
      // Fetch the maximum plan ID from the workoutplans table
      const { data: latestPlanIdData, error: fetchError } = await supabase
        .from('workoutplans')
        .select('plan_id')
        .order('plan_id', { ascending: false })
        .limit(1);
  
      if (fetchError) {
        throw new Error(fetchError.message);
      }
  
      const planId = latestPlanIdData[0].plan_id;
  
      console.log('Latest plan ID:', planId);
  
      // Return the plan ID
      return planId;
      
    } catch (error) {
      throw new Error('Failed to save workout plan to the database');
    }
  };
  
  // const saveWorkoutPlan = async (workoutPlanData) => {
  //   try {
  //     // Insert the workout plan data into the database table named 'workoutplans'
  //     const { error } = await supabase.from('workoutplans').insert([workoutPlanData]);
  
  //     if (error) {
  //       throw new Error(error.message);
  //     }
  
  //     console.log('Workout plan saved successfully');


  //   if (fetchError) {
  //     throw new Error(fetchError.message);
  //   }

  //   // Get the generated plan ID

  //   } catch (error) {
  //     throw new Error('Failed to save workout plan to the database');
  //   }
  // };
  
  const saveRecommendedExercises = async (recommendedExercises, planId) => {
    try {
      // Create an array to hold promises for each insert operation
      const insertPromises = recommendedExercises.map(async (exercise) => {
        const { data, error } = await supabase.from('exercisesinplan').insert({
          exercise_id: exercise.id,
          plan_id: planId,
          exercise_name: exercise.name,
          description: exercise.desc,
          exercise_body_part: exercise.bodysection,
          exercise_equipment: exercise.equipment,
          reps: exercise.reps,
          sets: exercise.sets,
        });
        
        if (error) {
          throw new Error(error.message);
        }
  
        return data; // Return the inserted data if successful
      });
  
      // Wait for all insert operations to complete
      const insertedData = await Promise.all(insertPromises);
  
      console.log('Recommended exercises saved successfully');
      return insertedData; // Return the inserted data if needed
    } catch (error) {
      throw new Error('Failed to save recommended exercises to the database');
    }
  };
  
  


  return (
    <View style={styles.container}>
      <View style={styles.section}>
      
  <Text style={styles.heading}>Goal Details</Text>
      </View>
   <View style={styles.blackishGreySection}>
        <View style={styles.section}>
        <Text style={styles.label}>Select Time Limit:</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select Time Limit', value: null }}
            onValueChange={(value) => setSelectedTimeLimit(value)}
            items={[
              { label: '30 minutes', value: '30' },
              { label: '60 minutes', value: '60' },
            ]}
            style={pickerSelectStyles}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Select Body Section:</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select Muscle', value: null }}
            onValueChange={(value) => setSelectedBodySection(value)}
            items={[
              { id: 1, name: 'Core' },
              { id: 2, name: 'Back' },
              { id: 3, name: 'Shoulders' },
              { id: 4, name: 'Legs' },
              { id: 5, name: 'Arms' },
              { id: 6, name: 'Glutes' },
              { id: 7, name: 'Neck' },
              { id: 8, name: 'Chest' },
            ].map(muscle => ({ label: muscle.name, value: muscle.name}))}
            style={pickerSelectStyles}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Select Fitness Level:</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select Fitness Level', value: null }}
            onValueChange={(value) => setSelectedFitnessLevel(value)}
            items={[
              { label: 'Beginner', value: 'Beginner' },
              { label: 'Intermediate', value: 'Intermediate' },
              { label: 'Advanced', value: 'Advanced' },
            ]}
            style={pickerSelectStyles}
          />
          </View>
          <View style={styles.section}>
          <Text style={styles.label}>Select Start Date:</Text>
  <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
    <Text style={styles.datePickerButtonText}>{selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}</Text>
    {showDatePicker && (
      <RNDateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={handleDateChange}

      />
    )}
  </TouchableOpacity>

      <View style={styles.blackishGreySection}>
        <Text style={styles.label}>Goal Name:</Text>
        <TextInput
          style={[styles.label, styles.yellowOutline]} // Apply yellow outline style
          placeholder="Enter your goal name"
          placeholderTextColor="#888"
          value={goalName}
          onChangeText={setGoalName}
        />
      </View>

        </View>
        
        <TouchableOpacity style={[styles.submitButton, styles.yellowOutline]} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        
      </View>

    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CA9329',
    borderRadius: 10,
    color: 'white',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CA9329',
    borderRadius: 10,
    color: 'white',
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  section: {
    marginBottom: 20,
  },
  blackishGreySection: {
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  submitButton: {
    backgroundColor: 'black',
    padding: 10,
    alignItems: 'center',
    borderRadius: 35,
    marginTop: 20,
  
  },
  submitButtonText: {
    color: '#CA9329',
    fontWeight: 'bold',
    fontSize: 18,
  },
  yellowOutline: {
    borderColor: '#CA9329',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CA9329',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: 'white',
  },

});

export default GoalDetailsScreen;
