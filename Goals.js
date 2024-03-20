import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';

const Goals = ({ route, navigation }) => {
  const bmi = parseFloat(route.params?.bmi); // Ensure bmi is a float
  const [selectedGoals, setSelectedGoals] = useState([]);

  const goalsBasedOnBMI = () => {
    if (bmi < 18.5) return ['Weight gain', 'Muscle building'];
    if (bmi >= 18.5 && bmi <= 24.9) return ['Maintaining current weight', 'Increasing muscle mass'];
    if (bmi >= 25) return ['Weight loss', 'Improving cardiovascular health'];
    return [];
  };

  const allGoals = [
    'Weight gain',
    'Muscle building',
    'Maintaining current weight',
    'Increasing muscle mass',
    'Weight loss',
    'Improving cardiovascular health',
  ];
  
  const recommendedGoals = goalsBasedOnBMI();

  const handleSelectGoal = (goal) => {
    setSelectedGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]);
  };

  const navigateToSelectDateAndSlot = () => {
    if (selectedGoals.length === 0) {
      alert("Please select at least one goal.");
      return;
    }
    navigation.navigate('SelectDateAndSlot', { selectedGoals });
  };

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [selectedGoals]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select Your Goals</Text>
      {recommendedGoals.length > 0 && (
        <>
          <Text style={styles.subTitle}>Recommended Goals for Your BMI ({bmi.toFixed(1)}):</Text>
          {recommendedGoals.map((goal, index) => (
            <TouchableOpacity key={index} style={[styles.goalOption, selectedGoals.includes(goal) && styles.selectedGoal]} onPress={() => handleSelectGoal(goal)}>
              <Text style={styles.buttonText}>{goal}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
      <Text style={styles.subTitle}>Other Goals:</Text>
      {allGoals.filter(goal => !recommendedGoals.includes(goal)).map((goal, index) => (
        <TouchableOpacity key={index} style={[styles.goalOption, selectedGoals.includes(goal) && styles.selectedGoal]} onPress={() => handleSelectGoal(goal)}>
          <Text style={styles.buttonText}>{goal}</Text>
        </TouchableOpacity>
      ))}
      <Animated.View style={[styles.summary, { opacity: fadeAnim }]}>
      <TouchableOpacity style={styles.makePlanButton} onPress={navigateToSelectDateAndSlot}>
        <Text style={styles.buttonText}>Select Date and Time</Text>
      </TouchableOpacity>

      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    color: '#FFA500',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  goalOption: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 25,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  selectedGoal: {
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summary: {
    width: '90%',
    marginTop: 20,
  },
  makePlanButton: {
    backgroundColor: '#FFA500',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Goals;
