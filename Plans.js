// Plans.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Plans = ({ route }) => {
  const { selectedGoals } = route.params;

  // Example function to map goals to plans. You should customize this based on your application's needs.
  const getPlanForGoal = (goal) => {
    const plans = {
      'Weight gain': 'Consume high-calorie nutritious foods and engage in strength training.',
      'Muscle building': 'Focus on protein intake and progressive overload in weight lifting.',
      'Maintaining current weight': 'Maintain a balanced diet and regular exercise routine.',
      'Increasing muscle mass': 'Increase your protein and calorie intake and lift heavier weights.',
      'Weight loss': 'Create a calorie deficit through diet and include cardio and strength training.',
      'Improving cardiovascular health': 'Regular cardiovascular exercises, such as running, swimming, or cycling.',
    };
    return plans[goal] || 'No specific plan available for this goal.';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Plan</Text>
      {selectedGoals.map((goal, index) => (
        <View key={index} style={styles.planContainer}>
          <Text style={styles.goal}>{goal}</Text>
          <Text style={styles.plan}>{getPlanForGoal(goal)}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  planContainer: {
    marginBottom: 30,
  },
  goal: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  plan: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default Plans;
