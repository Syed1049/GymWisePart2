import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const TrainersModule = () => {
  // Sample data for trainers
  const [trainers, setTrainers] = useState([
    { id: '1', name: 'John Doe', image: { uri: 'https://via.placeholder.com/100' }, expertise: 'Fitness, Strength Training', rating: 4.5 },
    { id: '2', name: 'Jane Smith', image: { uri: 'https://via.placeholder.com/100' }, expertise: 'Yoga, Pilates', rating: 4.8 },
    { id: '3', name: 'Mike Johnson', image: { uri: 'https://via.placeholder.com/100' }, expertise: 'Cardio, Endurance', rating: 4.6 },
  ]);

  // Render item function for FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.trainerContainer}>
      <Image source={item.profilePic} style={styles.profilePic} />
      <View style={styles.trainerInfo}>
        <Text style={styles.trainerName}>{item.name}</Text>
        <Text style={styles.trainerDetails}>Expertise: {item.expertise}</Text>
        <Text style={styles.trainerDetails}>Rating: {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.moduleTitle}>Find a Trainer</Text>
      <FlatList
        data={trainers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  moduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  trainerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trainerDetails: {
    fontSize: 16,
    color: '#666',
  },
});

export default TrainersModule;
