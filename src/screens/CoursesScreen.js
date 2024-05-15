import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../supabase';

const CoursesScreen = () => {
  const [createdCourses, setCreatedCourses] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const navigation = useNavigation();

  useEffect(() => {
    fetchCreatedCourses();
  }, []);

  const fetchCreatedCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*');

      if (error) {
        throw new Error(error.message);
      }

      setCreatedCourses(data || []);
    } catch (error) {
      console.error('Error fetching created courses:', error.message);
    } finally {
      setLoading(false); // Update loading status after fetching courses
    }
  };

  const handleCourseDetailsPress = (courseId) => {
    navigation.navigate('CourseDetailsScreen', { courseId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.heading}>My Courses</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CourseCreationScreen')} style={styles.plusButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
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
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#CA9329" />
      ) : (
        <ScrollView style={styles.courseContainer}>
          {createdCourses.map((course, index) => (
            <TouchableOpacity key={index} style={styles.courseCard} onPress={() => handleCourseDetailsPress(course.course_id)}>
              <Text style={styles.courseName}>{course.course_name}</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
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
  plusButton: {
    marginLeft: 10,
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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseContainer: {
    flex: 1,
  },
  courseCard: {
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  courseName: {
    fontSize: 18,
    color: '#CA9329',
  },
});

export default CoursesScreen;
