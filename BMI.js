import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

const BMI = ({ navigation }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial value for opacity: 0

  useEffect(() => {
    if (bmi !== null) {
      Animated.timing(
        fadeAnim,
        {
          toValue: 1, // Final value of opacity: 1
          duration: 1000, // Animation duration
          useNativeDriver: true,
        }
      ).start();
    }
  }, [bmi]); // Dependency array includes bmi

  const handleCalculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const calculatedBMI = (weight / (heightInMeters ** 2)).toFixed(2);
      setBMI(calculatedBMI);
      setBmiCategory(getBmiCategory(calculatedBMI));
      Keyboard.dismiss();
    }
  };

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi <= 24.9) return 'Normal weight';
    if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
    return 'Obesity';
  };

  const navigateToGoals = () => {
    navigation.navigate('Goals', { bmi: bmi }); // Pass 'bmi' as a parameter to the 'Goals' screen
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter your Height (in cm):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={height}
            onChangeText={(text) => setHeight(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter your Weight (in kg):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={weight}
            onChangeText={(text) => setWeight(text)}
          />
        </View>
        <TouchableOpacity style={styles.roundButton} onPress={handleCalculateBMI}>
          <Text style={styles.buttonText}>Calculate BMI</Text>
        </TouchableOpacity>
        {bmi && (
          <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
            <View style={styles.resultBackground}>
              <Text style={styles.resultText}>Your BMI is: {bmi}</Text>
              <Text style={styles.bmiCategory}>{bmiCategory}</Text>
            </View>
            <TouchableOpacity style={[styles.roundButton, styles.goalsButton]} onPress={navigateToGoals}>
              <Text style={styles.buttonText}>Go to Goals</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  input: {
    height: 45,
    width: 290,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    color: '#fff',
  },
  roundButton: {
    marginTop: 20,
    width: 160,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#FFA500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultBackground: {
    backgroundColor: '#808080', // Grey background for the result
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  resultText: {
    color: '#fff',
    marginBottom: 10,
  },
  bmiCategory: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalsButton: {
    marginTop: 20, // Ensure some spacing between the result and the button
  },
});

export default BMI;
