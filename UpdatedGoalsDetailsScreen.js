import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from './supabase';
import { getUserSession } from './SessionService';

const UpdatedGoalDetailsScreen = () => {
  const [selectedTimeLimit, setSelectedTimeLimit] = useState('');
  const [selectedBodySection, setSelectedBodySection] = useState('');
  const [recommendedExercises, setRecommendedExercises] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [goalName, setGoalName] = useState('');
  const [userId, setUserId] = useState(null);
  const [userBMI, setUserBMI] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bmiCategory, setBMICategory] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getUserSession();
        if (session && session.userId) {
          setUserId(session.userId);
          // Fetch BMI and calculate BMI category
          const userData = await fetchBMI(session.userId);
          if (userData && userData.bmi) {
            setUserBMI(userData.bmi);
            const category = getBMICategory(userData.bmi);
            setBMICategory(category);
          }
        }
      } catch (error) {
        console.error('Error fetching user session:', error.message);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {

    try {
      console.log(bmiCategory)
      const exercises = await fetchExercises(selectedBodySection, bmiCategory);
      if (exercises.length === 0) {
        throw new Error('No exercises available for the selected body section and BMI.');
      }
      const recommended = await recommendExercises(exercises, selectedTimeLimit);
      setRecommendedExercises(recommended);
      navigation.navigate('WorkoutPlanScreen', { recommendedExercises });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to generate workout plan. Please try again.');
    }
  };

  const fetchBMI = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('bmi')
        .eq('id', userId)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw new Error('Failed to fetch BMI from the database');
    }
  };


  const fetchExercises = async (bodySection, bmiCategory) => {
    try {
        const { data, error } = await supabase
            .from('exercise_goals')
            .select('exercise_id, exercise_title, exercise_desc, exercise_equipment, exercise_bodysection, sets, reps')
            .eq('exercise_bodysection', bodySection)
            .eq('bmi_category', bmiCategory) // Filter by BMI category
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


const recommendExercises = (exercises, timeLimit) => {
  // Get the number of exercises to recommend based on the time limit
  const recommendedCount = timeLimit === '30' ? 6 : 12; // Assuming 6 exercises for 30 minutes and 12 exercises for 60 minutes

  // Return the first 'recommendedCount' exercises
  const recommendedExercises = exercises.slice(0, recommendedCount).map((exercise) => ({
    ...exercise,
    id: exercise.exercise_id,
    name: exercise.exercise_title,
    desc: exercise.exercise_desc,
    equipment: exercise.exercise_equipment,
    bodysection: exercise.exercise_bodysection,
  }));

  return recommendedExercises;
};



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
        console.log(userId)
      }
    } catch (error) {
      console.error('Error fetching user session:', error.message);
    }
  };

  
  
  
const getBMICategory = (bmi) => {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
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
            placeholder={{ label: 'Select Body Section', value: null }}
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
            ].map(muscle => ({ label: muscle.name, value: muscle.name }))}
            style={pickerSelectStyles}
          />
        </View>
        {/* <View style={styles.section}>
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
        </View> */}
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
              style={[styles.label, styles.yellowOutline]}
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

export default UpdatedGoalDetailsScreen;
