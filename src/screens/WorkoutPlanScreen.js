import React from 'react';
import { View, Text, StyleSheet, ScrollView ,TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const WorkoutPlanScreen = ({ route }) => {

  const { recommendedExercises } = route.params; // Receive recommended exercises from route params
  const navigation =useNavigation();
  console.log("Received recommended exercises:", recommendedExercises);
  const handleSubmit = () => {
  navigation.navigate('GoalsScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>Generated Workout Plan:</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {recommendedExercises && recommendedExercises.length > 0 ? (
          recommendedExercises.map((exercise, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.exerciseTitle}>{exercise.exercise_title}</Text>
              <Text style={styles.heading}>Description:</Text>
              <Text style={styles.exerciseDetail}>
                {exercise.exercise_desc ? exercise.exercise_desc : "No description available"}
              </Text>
              <Text style={styles.heading}>Body Part:</Text>
              <Text style={styles.exerciseDetail}>{exercise.exercise_muscle}</Text>
              <Text style={styles.heading}>Equipment:</Text>
              <Text style={styles.exerciseDetail}>{exercise.exercise_equipment}</Text>
              <Text style={styles.heading}>Reps:</Text>
              <Text style={styles.exerciseDetail}>{exercise.reps}</Text>
              <Text style={styles.heading}>Sets:</Text>
              <Text style={styles.exerciseDetail}>{exercise.sets}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.errorText}>No workout plan available</Text>)}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Okay</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  mainHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CA9329',
    marginBottom: 25,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CA9329',
    marginBottom: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  exerciseDetail: {
    fontSize: 12,
    color: 'white',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  submitButton: {
    backgroundColor: '#CA9329',
    padding: 10,
    alignItems: 'center',
    borderRadius: 35,
    marginTop: 20,
    width:100,
  alignSelf:'center',
  },
  submitButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default WorkoutPlanScreen;
