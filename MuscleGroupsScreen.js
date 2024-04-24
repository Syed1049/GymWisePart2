import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MuscleGroupsScreen = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  const muscleGroups = [
    { id: 1, name: 'Chest' },
    { id: 2, name: 'Back' },
    { id: 3, name: 'Shoulders' },
    { id: 4, name: 'Legs' },
    { id: 5, name: 'Arms' },
    { id: 6, name: 'Glutes' },
    { id: 7, name: 'Neck' },
    { id: 8, name: 'Abdominals' },
  ];

  const handleMuscleSelect = (muscle) => {
    setSelectedMuscle(muscle);
    // You can perform any action here when a muscle group is selected, such as navigation to another screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Muscle Group</Text>
      <View style={styles.muscleGroupContainer}>
        {muscleGroups.map((muscle) => (
          <TouchableOpacity
            key={muscle.id}
            style={[
              styles.muscleGroupCard,
              selectedMuscle === muscle ? styles.selectedCard : null,
            ]}
            onPress={() => handleMuscleSelect(muscle)}
          >
            <Text style={styles.muscleGroupName}>{muscle.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  muscleGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  muscleGroupCard: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
  },
  selectedCard: {
    backgroundColor: 'blue', // Change color as per your design
  },
  muscleGroupName: {
    fontSize: 16,
  },
});

export default MuscleGroupsScreen;
