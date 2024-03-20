// FitnessGoalsPage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecentActivityPage = () => {
  const fitnessGoalsData = {
    currentGoal: 'Weight Loss',
    targetWeight: 65,
    workoutFrequency: '3-4 times per week',
    duration: '3 months',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Fitness Goals Page</Text>

      <Text style={styles.goalTitle}>Current Goal</Text>
      <Text style={styles.goalValue}>{fitnessGoalsData.currentGoal}</Text>

      <Text style={styles.goalTitle}>Target Weight</Text>
      <Text style={styles.goalValue}>{fitnessGoalsData.targetWeight} kg</Text>

      <Text style={styles.goalTitle}>Workout Frequency</Text>
      <Text style={styles.goalValue}>{fitnessGoalsData.workoutFrequency}</Text>

      <Text style={styles.goalTitle}>Duration</Text>
      <Text style={styles.goalValue}>{fitnessGoalsData.duration}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#010102', // Set your desired background color
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  goalValue: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
});

export default RecentActivityPage;
