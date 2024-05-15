import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../supabase';
import { Video } from 'expo-av';

const CourseDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { courseId } = route.params;
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      const { data: courseData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('course_id', courseId)
        .single();
  
      if (error) {
        throw error;
      }
  
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('course_exercises')
        .select('*')
        .eq('course_id', courseId);
  
      if (exerciseError) {
        throw exerciseError;
      }
  
      setCourseDetails({ ...courseData, exercises: exerciseData });
    } catch (error) {
      console.error('Error fetching course details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!courseDetails) {
    return (
      <View style={styles.container}>
        <Text>Error fetching course details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    
      <ScrollView style={styles.content}>
        <Text style={styles.heading}>{courseDetails.course_name}</Text>
        <Text style={styles.detail}>Difficulty: {courseDetails.course_difficulty}</Text>
        <Text style={styles.detail}>Body Part: {courseDetails.course_body_part}</Text>
        <Text style={styles.detail}>Number of Days: {courseDetails.num_days}</Text>
        <Text style={styles.sectionHeading}>Exercises:</Text>
        {courseDetails.exercises && courseDetails.exercises.map((exercise, index) => (
          <ExerciseDetails key={index} exercise={exercise} />
        ))}
      </ScrollView>
    </View>
  );
};

const ExerciseDetails = ({ exercise }) => {
  return (
    <View style={styles.exercise}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.exerciseDescription}>{exercise.description}</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detail}>Sets: {exercise.sets}</Text>
        <Text style={styles.detail}>Reps: {exercise.reps}</Text>
      </View>
      <Text style={styles.detail}>Body Part: {exercise.body_part}</Text>
      <Text style={styles.detail}>Equipment: {exercise.equipment}</Text>
      {exercise.video_data && (
        <Video
          source={{ uri: exercise.video_data }}
          style={styles.video}
          resizeMode="contain"
          useNativeControls
        />
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
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    color: 'white',
    marginRight: 10,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  exercise: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    padding: 15,
  },
  exerciseName: {
    fontSize: 18,
    color: '#CA9329',
    marginBottom: 5,
  },
  exerciseDescription: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default CourseDetailsScreen;
