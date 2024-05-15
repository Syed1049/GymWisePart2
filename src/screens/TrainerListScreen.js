import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../supabase';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5 for icons

const TrainerListScreen = () => {
  const [trainers, setTrainers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const { data, error } = await supabase.from('trainer').select('*');
      if (error) {
        throw new Error(error.message);
      }
      setTrainers(data || []);
    } catch (error) {
      console.error('Error fetching trainers:', error.message);
    }
  };

  const handleTrainerPress = (trainerId) => {
    // Navigate to the trainer details screen with the selected trainer ID
    navigation.navigate('TrainerDetailsScreen', { trainerId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Trainers</Text>
      {trainers.map((trainer) => (
        <TouchableOpacity key={trainer.id} style={styles.trainerItem} onPress={() => handleTrainerPress(trainer.id)}>
          <FontAwesome5 name="user-circle" size={80} color="#CA9329" style={styles.trainerAvatar} />
          <View style={styles.trainerInfo}>
            <Text style={styles.trainerName}>{trainer.name}</Text>
            <Text style={styles.trainerSpecialization}>{trainer.specialization}</Text>
            <View style={styles.trainerDetails}>
              <View style={styles.detailRow}>
                <FontAwesome5 name="user" size={16} color="white" style={styles.detailIcon} />
                <Text style={styles.detailText}>Age: {trainer.age}</Text>
              </View>
              <View style={styles.detailRow}>
                <FontAwesome5 name="weight" size={16} color="white" style={styles.detailIcon} />
                <Text style={styles.detailText}>Weight: {trainer.weight} kg</Text>
              </View>
              <View style={styles.detailRow}>
                <FontAwesome5 name="ruler-vertical" size={16} color="white" style={styles.detailIcon} />
                <Text style={styles.detailText}>Height: {trainer.height} cm</Text>
              </View>
              <View style={styles.detailRow}>
                <FontAwesome5 name="heartbeat" size={16} color="white" style={styles.detailIcon} />
                <Text style={styles.detailText}>BMI: {trainer.bmi}</Text>
              </View>
              <View style={styles.detailRow}>
                <FontAwesome5 name="phone" size={16} color="white" style={styles.detailIcon} />
                <Text style={styles.detailText}>Phone: {trainer.phone_number}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  trainerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },
  trainerAvatar: {
    marginRight: 20,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  trainerSpecialization: {
    fontSize: 16,
    marginBottom: 5,
    color: '#CA9329',
  },
  trainerDetails: {
    marginTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailIcon: {
    marginRight: 5,
  },
  detailText: {
    fontSize: 14,
    color: 'white',
  },
});

export default TrainerListScreen;
