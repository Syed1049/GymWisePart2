import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { saveWorkoutPlan, saveRecommendedExercises, fetchExercises } from './CustomGoalDB'; // Import database functions

const CustomGoalScreen = () => {
  const [selectedTimeLimit, setSelectedTimeLimit] = useState('');
  const [selectedBodySection, setSelectedBodySection] = useState('');
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [exercises, setExercises] = useState([]); // State to hold fetched exercises
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch exercises when component mounts
    const fetchExercisesData = async () => {
      try {
        const fetchedExercises = await fetchExercises(selectedBodySection, selectedFitnessLevel);
        setExercises(fetchedExercises);

      } catch (error) {
        console.error('Error fetching exercises:', error.message);
        // Handle error
      }
    };

    if (selectedBodySection && selectedFitnessLevel) {
      fetchExercisesData();
    }
  }, [selectedBodySection, selectedFitnessLevel]);

  const handleSubmit = async () => {
    try {
      // Save workout plan
      const workoutPlanData = {
        plan_name: goalName,
        plan_start_date: selectedDate,
        plan_end_date: selectedDate,
        duration_minutes: parseInt(selectedTimeLimit),
      };
      const planId = await saveWorkoutPlan(workoutPlanData);

      // Save recommended exercises
      const recommendedExercises = [];
      // Assuming you have the recommended exercises data here
      await saveRecommendedExercises(fetchExercises, planId);

      // Navigate to the next screen
      navigation.navigate('WorkoutPlanScreen', { recommendedExercises });
    } catch (error) {
      console.error('Error:', error.message);
      // Handle error
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Custom Goal</Text>
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
              { label: 'Core', value: 'Core' },
              { label: 'Back', value: 'Back' },
              { label: 'Shoulders', value: 'Shoulders' },
              { label: 'Legs', value: 'Legs' },
              { label: 'Arms', value: 'Arms' },
              { label: 'Glutes', value: 'Glutes' },
              { label: 'Neck', value: 'Neck' },
              { label: 'Chest', value: 'Chest' },
            ]}
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
        </View>
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

export default CustomGoalScreen;
