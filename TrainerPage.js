// TrainerPage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TrainerPage = () => {
  const trainerData = {
    trainers: [
      {
        name: 'John Doe',
        specialization: 'Personal Trainer',
        experience: '5 years',
      },
      {
        name: 'Jane Smith',
        specialization: 'Yoga Instructor',
        experience: '3 years',
      },
      // Add more trainers as needed
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Trainer Page</Text>

      {trainerData.trainers.map((trainer, index) => (
        <View key={index} style={styles.trainerContainer}>
          <Text style={styles.trainerName}>{trainer.name}</Text>
          <Text style={styles.trainerSpecialization}>{trainer.specialization}</Text>
          <Text style={styles.trainerExperience}>Experience: {trainer.experience}</Text>
        </View>
      ))}
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
  trainerContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#17171A',
    borderRadius: 12,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  trainerSpecialization: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  trainerExperience: {
    fontSize: 16,
    color: 'white',
  },
});

export default TrainerPage;
