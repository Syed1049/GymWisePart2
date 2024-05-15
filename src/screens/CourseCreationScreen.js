import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../../supabase';
import { saveCourseInfo, saveExerciseInfo } from './courseDB';
import{getTrainerSession} from './SessionService'
import { Platform, PermissionsAndroid } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid'; 
import tus from 'tus-js-client';
const CourseCreationScreen = () => {
  const [courseName, setCourseName] = useState('');
  const [courseDifficulty, setCourseDifficulty] = useState('');
  const [courseBodyPart, setCourseBodyPart] = useState('');
  const [numDays, setNumDays] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [videoUri, setVideoUri] = useState('');
  const [trainerId, setTrainerId] = useState(null); // State to store trainer ID

  useEffect(() => {
    if (numDays.trim() !== '' && !isNaN(numDays) && parseInt(numDays) > 0) {
      const initialExerciseList = Array.from({ length: parseInt(numDays) }, () => ({ expanded: false, exercises: [] }));
      setExerciseList(initialExerciseList);
    }

  }, [numDays]);
  useEffect(() => {
    // Fetch trainer ID from session on component mount
    const fetchTrainerId = async () => {
      const session = await getTrainerSession();
      if (session && session.trainerId) {
        setTrainerId(session.trainerId);
      } else {
        // Handle case when trainer ID is not available in session
        console.error('Trainer ID not found in session.');
      }
    };

    fetchTrainerId(); // Call fetchTrainerId function
  }, []);


  const pickVideo = async () => {

      try {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted !== true) {
          console.log('Permission to access media library was denied');
          return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (result.cancelled) {
          console.log('No video selected');
          return;
        }
    
        if (!result.assets || result.assets.length === 0) {
          console.log('No video asset found');
          return;
        }
    
        const videoAsset = result.assets[0];
        if (!videoAsset.uri) {
          console.log('No video URI found');
          return;
        }
    
        // Create a Tus upload
        const upload = new tus.Upload(videoAsset.uri, {
          endpoint: 'https://${GymWise}.supabase.co/storage/v1/upload/resumable',
          resume: true,
          metadata: {
            filename: videoAsset.fileName,
            filetype: videoAsset.type,
          },
          onError: (error) => {
            console.error('Tus upload error:', error);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            console.log(`Uploaded ${bytesUploaded} bytes of ${bytesTotal}`);
          },
          onSuccess: () => {
            console.log('Tus upload complete');
          },
        });
    
        // Start the Tus upload
        upload.start();
      } catch (error) {
        console.error('Error picking and uploading video:', error);
      }
  };
  
  const handleSave = async () => {
    // Validate course data before saving to the database
    if (!courseName.trim() || !courseDifficulty.trim() || !courseBodyPart.trim()) {
      Alert.alert('Error', 'Please fill in all required fields for the course.');
      return;
    }
  
    try {
      // Save course info
      const trainerIdInt = parseInt(trainerId);
      if (isNaN(trainerIdInt)) {
        throw new Error('Invalid trainer ID.');
      }
      const courseId = await saveCourseInfo(courseName, courseDifficulty, courseBodyPart, numDays, trainerIdInt); // Replace 1 with the actual trainer ID
      
      // Save exercise info
      await saveExerciseInfo(courseId, exerciseList);
  
      // Display success message or navigate to another screen upon successful save
      Alert.alert('Success', 'Course saved successfully!');
    } catch (error) {
      console.error('Error saving course:', error.message);
      Alert.alert('Error', 'An error occurred while saving the course. Please try again later.');
    }
  };
  
 
  
  const addExercise = (dayIndex) => {
    const updatedExerciseList = [...exerciseList];
    const newExercise = {
      name: '',
      description: '',
      difficulty: '',
      video: '',
      sets: '',
      reps: '',
      equipment: '',
    };
    updatedExerciseList[dayIndex].exercises.push(newExercise);
    setExerciseList(updatedExerciseList);
  };
  
  const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
    const updatedExerciseList = [...exerciseList];
    updatedExerciseList[dayIndex].exercises[exerciseIndex][field] = value;
    setExerciseList(updatedExerciseList);
  };
  
  const removeExercise = (dayIndex, exerciseIndex) => {
    const updatedExerciseList = [...exerciseList];
    updatedExerciseList[dayIndex].exercises.splice(exerciseIndex, 1);
    setExerciseList(updatedExerciseList);
  };

  const removeDay = (dayIndex) => {
    if (exerciseList[dayIndex].exercises.length === 0) {
      const updatedExerciseList = [...exerciseList];
      updatedExerciseList.splice(dayIndex, 1);
      setExerciseList(updatedExerciseList.map((day, index) => ({
        ...day,
        expanded: index === 0 ? true : day.expanded
      })));
      setNumDays(updatedExerciseList.length.toString());
    } else {
      Alert.alert('Error', 'Cannot remove day with exercises. Remove exercises first.');
    }
  };

  const addDay = () => {
    const updatedNumDays = parseInt(numDays) + 1;
    setNumDays(updatedNumDays.toString());
    const updatedExerciseList = [...exerciseList];
    updatedExerciseList.push({ expanded: true, exercises: [] });
    setExerciseList(updatedExerciseList);
  };

  const toggleDayExpand = (index) => {
    const updatedExerciseList = [...exerciseList];
    updatedExerciseList[index].expanded = !updatedExerciseList[index].expanded;
    setExerciseList(updatedExerciseList);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create New Course</Text>
      <TextInput
        style={styles.input}
        placeholder="Course Name"
        value={courseName}
        onChangeText={setCourseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Difficulty (Beginner, Intermediate, Advanced)"
        value={courseDifficulty}
        onChangeText={setCourseDifficulty}
      />
      <TextInput
        style={styles.input}
        placeholder="Body Part"
        value={courseBodyPart}
        onChangeText={setCourseBodyPart}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Days"
        keyboardType="numeric"
        value={numDays}
        onChangeText={(value) => setNumDays(value.replace(/[^0-9]/g, ''))}
      />
      {exerciseList.map((day, dayIndex) => (
        <View key={dayIndex}>
          <TouchableOpacity style={styles.dayHeader} onPress={() => toggleDayExpand(dayIndex)}>
            <Text style={styles.dayHeaderText}>Day {dayIndex + 1}</Text>
            {day.exercises.length === 0 && (
              <TouchableOpacity onPress={() => removeDay(dayIndex)} style={styles.removeDayButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          {day.expanded && (
            <View style={styles.exerciseContainer}>
              <TouchableOpacity style={styles.addButton} onPress={() => addExercise(dayIndex)}>
                <Text style={styles.addButtonText}>Add Exercise</Text>
              </TouchableOpacity>
              {day.exercises.map((exercise, exerciseIndex) => (
                <View key={exerciseIndex} style={styles.exercise}>
                  <TextInput
                    style={styles.input}
                    placeholder="Exercise Name"
                    value={exercise.name}
                    onChangeText={(value) => handleExerciseChange(dayIndex, exerciseIndex, 'name', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Exercise Description"
                    value={exercise.description}
                    onChangeText={(value) => handleExerciseChange(dayIndex, exerciseIndex, 'description', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Exercise Difficulty"
                    value={exercise.difficulty}
                    onChangeText={(value) => handleExerciseChange(dayIndex, exerciseIndex, 'difficulty', value)}
                  />
                 <View style={styles.videoField}>
  <TextInput
    style={[styles.input, styles.videoInput]}
    placeholder={exercise.video !== '' ? "Video Selected" : "Attach Video"}
    value={exercise.video !== '' ? "Video Selected" : ""}
    editable={false}
  />
  <TouchableOpacity onPress={pickVideo} style={styles.attachIcon}>
    <Ionicons name="attach" size={24} color="black" />
  </TouchableOpacity>

                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Sets"
                    keyboardType="numeric"
                    value={exercise.sets}
                    onChangeText={(value) => handleExerciseChange(dayIndex, exerciseIndex, 'sets', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Reps"
                    keyboardType="numeric"
                    value={exercise.reps}
                    onChangeText={(value) => handleExerciseChange(dayIndex, exerciseIndex, 'reps', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Equipment"
                    value={exercise.equipment}
                    onChangeText={(value) => handleExerciseChange(dayIndex, exerciseIndex, 'equipment', value)}
                  />
                  <TouchableOpacity onPress={() => removeExercise(dayIndex, exerciseIndex)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addDay}>
        <Text style={styles.addButtonText}>Add Day</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Course</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000', // Set background color to black
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // Set text color to white
  },
  input: {
    backgroundColor: '#555', // Set background color to gray
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: '#fff', // Set text color to white
  },
  addButton: {
    backgroundColor: '#000', // Set background color to black
    borderColor: '#ff8c00', // Set border color to orange
    borderWidth: 1,
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff', // Set text color to white
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButtonPressed: {
    backgroundColor: '#ff8c00', // Set background color to orange when pressed
  },
  dayHeader: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseContainer: {
    padding: 10,
    marginBottom: 10,
  },
  exercise: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#000', // Set background color to black
    borderColor: '#ff8c00', // Set border color to orange
    borderWidth: 1,
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff', // Set text color to white
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonPressed: {
    backgroundColor: '#ff8c00', // Set background color to orange when pressed
  },
  removeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  removeDayButton: {
    backgroundColor: '#dc3545',
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
  },
  videoField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachIcon: {
    marginLeft: 10,
  },
  videoInput: {
    backgroundColor: '#f9f9f9', 
    color: '#000', 
  },
});

export default CourseCreationScreen;
