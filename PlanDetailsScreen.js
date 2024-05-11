import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from './supabase';
import YoutubePlayer from 'react-native-youtube-iframe';
import axios from 'axios';

const PlanDetailsScreen = () => {
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const route = useRoute();
  const { planId } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    fetchExercises(planId);
  }, [planId]);

  const fetchExercises = async (planId) => {
    try {
      const { data, error } = await supabase
        .from('exercisesinplan')
        .select('*')
        .eq('plan_id', planId);

      if (error) {
        throw new Error(error.message);
      }

      setExercises(data || []);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const goToNextExercise = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const goToPrevExercise = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const toggleExerciseDone = (index) => {
    const newCompletedExercises = [...completedExercises];
    newCompletedExercises[index] = !newCompletedExercises[index];
    setCompletedExercises(newCompletedExercises);
  };

  const currentExercise = exercises[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>Plan Details:</Text>
      {error ? (
        <Text>Error: {error}</Text>
      ) : exercises.length === 0 ? (
        <Text>No exercises found for this plan.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.card}>
            <Text style={styles.heading}>Exercise Name:</Text>
            <Text style={styles.detail}>{currentExercise?.exercise_name || 'N/A'}</Text>
            <YoutubeVideo exerciseTitle={currentExercise?.exercise_name} />
            <Text style={styles.heading}>Description:</Text>
            <Text style={styles.detail}>{currentExercise?.description || 'No description available'}</Text>
            <Text style={styles.heading}>Body Part:</Text>
            <Text style={styles.detail}>{currentExercise?.exercise_body_part || 'N/A'}</Text>
            <Text style={styles.heading}>Equipment:</Text>
            <Text style={styles.detail}>{currentExercise?.exercise_equipment || 'N/A'}</Text>
            <Text style={styles.heading}>Reps:</Text>
            <Text style={styles.detail}>{currentExercise?.reps || 'N/A'}</Text>
            <Text style={styles.heading}>Sets:</Text>
            <Text style={styles.detail}>{currentExercise?.sets || 'N/A'}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, currentIndex === 0 && styles.disabledButton]}
                onPress={goToPrevExercise}
                disabled={currentIndex === 0}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, currentIndex === exercises.length - 1 && styles.disabledButton]}
                onPress={goToNextExercise}
                disabled={currentIndex === exercises.length - 1}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => toggleExerciseDone(currentIndex)}
              style={[styles.doneButton, completedExercises[currentIndex] && styles.completed]}
            >
              <Text style={[styles.doneButtonText, completedExercises[currentIndex] && styles.completedText]}>Done</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      {completedExercises.every((exercise) => exercise) && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate('GoalsScreen')}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const YoutubeVideo = ({ exerciseTitle }) => {
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    fetchYoutubeVideo(exerciseTitle);
  }, [exerciseTitle]);

  const fetchYoutubeVideo = async (title) => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: exerciseTitle,
          order: 'relevance',
          maxResults: 1,
          key: 'AIzaSyCEmWxr1PpBMNs44BjKQ_LhucLmIAFQ-84',
        },
      });

      const video = response.data.items[0];
      if (video) {
        setVideoId(video.id.videoId);
      } else {
        console.warn('No videos found for the selected exercise.');
      }
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    }
  };

  return videoId ? (
    <View style={styles.videoContainer}>
      <Text style={styles.videoHeading}>Video:</Text>
      <YoutubePlayer height={200} play={false} videoId={videoId} />
    </View>
  ) : null;
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
  scrollViewContent: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CA9329',
    marginBottom: 5,
  },
  detail: {
    fontSize: 12,
    color: 'white',
    marginBottom: 10,
  },
  videoContainer: {
    marginTop: 10,
  },
  videoHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CA9329',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#CA9329',
    padding: 10,
    alignItems: 'center',
    borderRadius: 35,
    width: 100,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  doneButton: {
    backgroundColor: 'red', // Changed default color to red
    padding: 10,
    alignItems: 'center',
    borderRadius: 35,
    marginTop: 20,
    width: 100,
  },
  doneButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  completed: {
    backgroundColor: '#0f0', // Green color for completed exercises
  },
  completedText: {
    color: 'white', // Changed text color to white for completed exercises
  },
  submitButton: {
    backgroundColor: '#CA9329',
    padding: 10,
    alignItems: 'center',
    borderRadius: 35,
    marginTop: 20,
    width: 100,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default PlanDetailsScreen;
